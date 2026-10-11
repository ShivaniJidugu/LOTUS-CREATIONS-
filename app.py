import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

# Page configuration
st.set_page_config(
    page_title="Lotus Creations",
    page_icon="🌸",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Read website files
BASE_DIR = Path(__file__).parent

html_path = BASE_DIR / "index.html"
css_path = BASE_DIR / "style.css"
js_path = BASE_DIR / "script.js"

st.markdown(
    """
    <style>
    header[data-testid="stHeader"] {
        display: none;
    }

    footer {
        display: none;
    }

    .block-container {
        padding: 0;
        max-width: 100%;
    }

    iframe {
        border: none;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# Check that all required files exist
if not html_path.exists():
    st.error("index.html file not found in the GitHub repository.")
elif not css_path.exists():
    st.error("style.css file not found in the GitHub repository.")
elif not js_path.exists():
    st.error("script.js file not found in the GitHub repository.")
else:
    # Load HTML, CSS and JavaScript
    html_content = html_path.read_text(encoding="utf-8")
    css_content = css_path.read_text(encoding="utf-8")
    js_content = js_path.read_text(encoding="utf-8")

    # Insert CSS and JavaScript into the HTML
    if "</head>" in html_content.lower():
        import re
        html_content = re.sub(
            r"</head>",
            lambda match: f"<style>{css_content}</style></head>",
            html_content,
            count=1,
            flags=re.IGNORECASE
        )
    else:
        html_content = f"<style>{css_content}</style>" + html_content

    if "</body>" in html_content.lower():
        import re
        html_content = re.sub(
            r"</body>",
            lambda match: f"<script>{js_content}</script></body>",
            html_content,
            count=1,
            flags=re.IGNORECASE
        )
    else:
        html_content += f"<script>{js_content}</script>"

    # Display the website
    components.html(
        html_content,
        height=2400,
        scrolling=True
    )
