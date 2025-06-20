import os
import shutil
import threading

from flask import Flask, request, send_from_directory
from flask_cors import CORS
from flask_restx import Api, Resource, fields
from werkzeug.utils import secure_filename

import globals
from chat import create_chat_thread, get_chat_thread, get_chat_threads, send_message
from core import (
    answer_pipeda,
    create_expert_knowledge_vector_store,
    embed_docs,
    evaluate_compliance,
    get_compliance_score_stats,
    get_control_compliance_by_id,
    get_csf_compliance,
    get_csf_recommendations,
    get_input_docs,
    get_top_5_threats,
    improve_documents,
    load_docs,
    new_vector_store,
    top_threat_info_by_id,
)

app = Flask(__name__)
CORS(app)
api = Api(app)


# Background Jobs
def process_questionnaire():
    print("Processing questionnaire in the background...")

    answer_pipeda()

    print("Questionnaire processing complete.")


def process_doc_improvements():
    print("Processing doc improvements in the background...")

    improve_documents()

    print("Doc improvements processing complete.")


# API Models
chat_model = api.model(
    "ChatMessage",
    {
        "message": fields.String(
            required=True, description="The message to share with agent"
        )
    },
)


# ----------------------
# START OF API ENDPOINTS
# ----------------------
@api.route("/threats")
class Threats(Resource):
    def get(self):
        return get_top_5_threats()


@api.route("/threat/<threat_id>")
class Threat(Resource):
    def get(self, threat_id):
        return top_threat_info_by_id(threat_id)


@api.route("/controls")
class Controls(Resource):
    def get(self):
        compliance = get_csf_compliance()

        return [compliance[control_id] for control_id in globals.csf_controls.keys()]


@api.route("/control/<control_id>")
class Control(Resource):
    def get(self, control_id):
        return get_control_compliance_by_id(control_id)


@api.route("/compliance")
class Compliance(Resource):
    def get(self):
        return get_compliance_score_stats()


@api.route("/documents")
class Documents(Resource):
    def get(self):
        input_docs = get_input_docs()

        result = []

        for doc in input_docs:
            result.append(doc.metadata)

        return result


@api.route("/improved_documents")
class ImprovedDocsList(Resource):
    def get(self):
        return globals.improved_docs


@api.route("/input_doc/<path:filename>")
class InputDocument(Resource):
    def get(self, filename):
        return send_from_directory("input_docs", filename)


@api.route("/improved_doc/<path:filename>")
class ImprovedDocument(Resource):
    def get(self, filename):
        return send_from_directory("improved_docs", filename)


@api.route("/chat/<thread_id>")
class ChatThread(Resource):
    def get(self, thread_id):
        return get_chat_thread(thread_id)

    @api.expect(chat_model)
    def post(self, thread_id):
        data = api.payload
        message = data.get("message", "")

        reply = send_message(message, thread_id)

        return {"reply": reply}


@api.route("/chat")
class Chat(Resource):
    def post(self):
        data = api.payload
        message = data.get("message", "")

        return create_chat_thread(message)


@api.route("/chats")
class Chats(Resource):
    def get(self):
        return get_chat_threads()


@api.route("/select_framework")
class SelectFramework(Resource):
    def post(self):
        data = request.get_json()
        framework_id = data.get("frameworkId")

        evaluate_compliance(framework_id)

        # Start docs improvement in the background
        threading.Thread(target=process_doc_improvements).start()

        return {"message": f"Framework set to {framework_id}"}


@api.route("/compliance_progress")
class ComplianceProgress(Resource):
    def get(self):
        if not globals.csf_controls:
            return 0

        return (globals.num_controls_evaluated / len(globals.csf_controls)) * 100


@api.route("/framework")
class Framework(Resource):
    def get(self):
        return {"frameworkId": globals.current_csf}


@api.route("/pipeda")
class Pipeda(Resource):
    def get(self):
        return globals.questionnaire_result


@api.route("/upload_docs")
class UploadDocs(Resource):
    def post(self):
        use_sample = request.args.get("useSample", default="false").lower() == "true"
        first_time = request.args.get("firstTime", default="true").lower() == "true"

        if first_time:
            if os.path.exists(globals.UPLOAD_FOLDER):
                shutil.rmtree(globals.UPLOAD_FOLDER)

            if os.path.exists(globals.IMPROVED_DOCS_DIR):
                shutil.rmtree(globals.IMPROVED_DOCS_DIR)

            new_vector_store()
            create_expert_knowledge_vector_store()

        os.makedirs(globals.UPLOAD_FOLDER, exist_ok=True)

        saved_files = []

        if use_sample:
            # Copy sample docs into input_docs
            sample_folder = "./sample_docs"
            for filename in os.listdir(sample_folder):
                src = os.path.join(sample_folder, filename)
                dst = os.path.join(globals.UPLOAD_FOLDER, filename)
                shutil.copy2(src, dst)
                saved_files.append(filename)
        else:
            if "file" not in request.files:
                return {"message": "No files part in the request"}, 400

            files = request.files.getlist("file")
            for file in files:
                filename = secure_filename(file.filename or "document.pdf")
                save_path = os.path.join(globals.UPLOAD_FOLDER, filename)
                file.save(save_path)
                saved_files.append(filename)

        # Process the documents
        load_docs(globals.UPLOAD_FOLDER)
        embed_docs()

        # Once docs are loaded and embeded - start evaluating PIPEDA in the background
        threading.Thread(target=process_questionnaire).start()

        csf_recommendations = get_csf_recommendations() if first_time else []

        # Reevaluate compliance if we are uploading new documents
        if not first_time and globals.current_csf:
            evaluate_compliance(globals.current_csf)

        return {
            "uploaded_files": saved_files,
            "csf_recommendations": csf_recommendations,
        }


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=9009)
