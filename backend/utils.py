import markdown2
from playwright.sync_api import sync_playwright


def markdown_to_pdf(markdown_text: str, output_path: str):
    html_content = markdown2.markdown(markdown_text)

    full_html = f"""
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 40px;
                line-height: 1.6;
                font-size: 14px;
            }}
            h1, h2, h3 {{
                color: #2c3e50;
                border-bottom: 1px solid #ddd;
                padding-bottom: 0.3em;
            }}
            code {{
                background-color: #f4f4f4;
                padding: 2px 4px;
                border-radius: 3px;
            }}
            pre {{
                background: #f4f4f4;
                padding: 10px;
                overflow-x: auto;
                border-radius: 5px;
            }}
        </style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_content(full_html, wait_until="domcontentloaded")
        page.pdf(
            path=output_path,
            format="A4",
            margin={"top": "1in", "bottom": "1in", "left": "1in", "right": "1in"},
        )
        browser.close()
