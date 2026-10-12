import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path
import re
from urllib.parse import quote

st.set_page_config(
    page_title="Lotus Creations",
    page_icon="🌸",
    layout="wide"
)

BASE_DIR = Path(__file__).parent

# Update these if your GitHub username/repository/branch differs
GITHUB_RAW = (
    "https://raw.githubusercontent.com/"
    "ShivaniJidugu/LOTUS-CREATIONS-/main/"
)

st.markdown("""
<style>
header[data-testid="stHeader"] {display:none;}
footer {display:none;}
.block-container {padding:0; max-width:100%;}
</style>
""", unsafe_allow_html=True)

html_file = BASE_DIR / "index.html"
css_file = BASE_DIR / "style.css"
js_file = BASE_DIR / "script.js"

if not html_file.exists():
    st.error("index.html file not found.")
elif not css_file.exists():
    st.error("style.css file not found.")
elif not js_file.exists():
    st.error("script.js file not found.")
else:
    html = html_file.read_text(encoding="utf-8")
    css = css_file.read_text(encoding="utf-8")
    js = js_file.read_text(encoding="utf-8")

    # Convert local image paths into GitHub raw URLs.
    # Supports images/name.jpg and name.jpg.
    def fix_path(path):
        path = path.strip()

        if (
            not path
            or path.startswith(("http://", "https://", "data:", "#", "//"))
            or path.startswith(("blob:", "javascript:"))
        ):
            return path

        clean = path.split("?")[0].split("#")[0]

        # Avoid changing CSS, JS and HTML file references.
        if clean.lower().endswith((".css", ".js", ".html")):
            return path

        # Use the repository path as written in the HTML/CSS.
        return GITHUB_RAW + quote(clean.lstrip("./"), safe="/")

    # Fix image src attributes in HTML.
    html = re.sub(
        r'(\bsrc\s*=\s*["\'])(?!https?://|data:|//)([^"\']+)(["\'])',
        lambda m: m.group(1) + fix_path(m.group(2)) + m.group(3),
        html,
        flags=re.IGNORECASE
    )

    # Fix local images used in CSS background-image: url(...)
    css = re.sub(
        r'url\(\s*(["\']?)(?!https?://|data:|//)([^)"\']+)\1\s*\)',
        lambda m: "url('" + fix_path(m.group(2)) + "')",
        css,
        flags=re.IGNORECASE
    )

    # Remove original linked CSS/JS tags to avoid loading them twice.
    html = re.sub(
        r'<link\b[^>]*href=["\'][^"\']*style\.css[^"\']*["\'][^>]*>',
        '',
        html,
        flags=re.IGNORECASE
    )
    html = re.sub(
        r'<script\b[^>]*src=["\'][^"\']*script\.js[^"\']*["\'][^>]*>\s*</script>',
        '',
        html,
        flags=re.IGNORECASE
    )

    # Insert CSS and JS into the HTML.
    if re.search(r"</head>", html, re.IGNORECASE):
        html = re.sub(
            r"</head>",
            lambda m: "<style>" + css + "</style>" + m.group(0),
            html,
            count=1,
            flags=re.IGNORECASE
        )
    else:
        html = "<style>" + css + "</style>" + html

    if re.search(r"</body>", html, re.IGNORECASE):
        html = re.sub(
            r"</body>",
            lambda m: "<script>" + js + "</script>" + m.group(0),
            html,
            count=1,
            flags=re.IGNORECASE
        )
    else:
        html += "<script>" + js + "</script>"

    components.html(
        html,
        height=3200,
        scrolling=True
    )
