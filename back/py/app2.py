from flask import Flask, request, send_file, jsonify
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import cairosvg
import io
import svgwrite
from pypdf import PdfReader, PdfWriter
import os
from flask_cors import CORS
import base64
import re

app = Flask(__name__)
CORS(app)

def camel_to_snake(camel_str):
    return re.sub(r'(?<!^)(?=[A-Z])', '_', camel_str).lower()

def write_html_loader(name, title):
    open('{name}.html'.format(name=name), 'wt', encoding='utf-8').write("""<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>title</title>
    </head>
    <body>
        <image src="{name}.svg"/>
    </body>
    </html>
    """.format(name=name, title=title))

def criar_svg(texto, estilo_texto, arquivo_saida='temp.svg'):
    largura = 400
    altura = 200
    dwg = svgwrite.Drawing(arquivo_saida, (800, 200), debug=True)
    # font data downloaded from google fonts
    dwg.embed_font(name="Indie Flower2", filename='back/py/BungeeShade-Regular.ttf')
    dwg.embed_stylesheet("""
    .flower14 {
        font-family: "Indie Flower2";
        font-size: 34px;
    }
    """)
    # This should work stand alone and embedded in a website!
    paragraph = dwg.add(dwg.g(class_="flower14", ))
    paragraph.add(dwg.text(texto, insert=(largura / 2, altura / 2)))
    dwg.save(pretty=True)



def inserir_svg_no_pdf(pdf_entrada, svg_arquivo, x, y, largura=200, altura=100, rotate=-90):
    png_data = cairosvg.svg2png(url=svg_arquivo, write_to=None)
    pdf_buffer = io.BytesIO()
    c = canvas.Canvas(pdf_buffer)
    
    png_stream = io.BytesIO(png_data)

    try:
        image = ImageReader(png_stream)
    except Exception as e:
        print(f"Erro ao criar a imagem: {e}")
        return None

    c.translate(x, y)
    c.rotate(rotate)
    c.drawImage(image, -50, 0, width=largura, height=altura, mask='auto')
    c.showPage()
    c.save()
    
    pdf_buffer.seek(0)
    reader = PdfReader(pdf_entrada)
    writer = PdfWriter()

    existing_page = reader.pages[0]
    new_page = PdfReader(pdf_buffer).pages[0]

    existing_page.merge_page(new_page)
    writer.add_page(existing_page)

    output_buffer = io.BytesIO()
    writer.write(output_buffer)
    output_buffer.seek(0)

    return output_buffer

@app.route('/add_rectangle', methods=['POST'])
def add_rectangle():
    if 'base64' not in request.json:
        return "No PDF file provided", 400

    pdf_base64 = request.json['base64']

    if not pdf_base64:
        return "PDF base64 string is empty", 400

    try:
        pdf_data = base64.b64decode(pdf_base64)
    except Exception as e:
        return f"Error decoding base64: {str(e)}", 400

    pdf_file = io.BytesIO(pdf_data)
    labels = request.json.get('labels', [])

    # Obtenha o arquivo de fonte base64
    font_base64 = request.json.get('font_file', None)
    font_path = "temp_font.ttf"
    if font_base64:
        with open(font_path, "wb") as font_file:
            font_file.write(base64.b64decode(font_base64))
    else:
        return "Font file not provided", 400
    
    if not labels:
        return "No labels provided", 400

    for label in labels:
        x = int(label['coordX'])
        y = int(label['coordY'])
        texto = label['texto']
        largura = int(label.get('largura', 200))  # Valor padrão
        altura = int(label.get('altura', 100))    # Valor padrão
        rotate = int(label.get('rotacao', -90))    # Valor padrão
        style = label.get('style', {
            'fill': 'darkblue',
            'fontSize': '34px',
            'fontFamily': 'CustomFont',
            'fontWeight': 'bold',
            'textAnchor': 'middle'
        })

        style_snake_case = {camel_to_snake(key): value for key, value in style.items()}

        svg = 'temp.svg'
        criar_svg(texto, style_snake_case,svg)
        resultado_pdf = inserir_svg_no_pdf(pdf_file, svg, x, y, largura, altura, rotate)

        pdf_file = resultado_pdf

    # Remover o arquivo da fonte após o uso
    os.remove(font_path)

    return send_file(pdf_file, mimetype='application/pdf', as_attachment=True, download_name='output.pdf')

@app.route('/encode_file', methods=['POST'])
def encode_file():
    # Verifica se o arquivo foi enviado
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    
    # Verifica se o arquivo é válido
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Lê o arquivo e codifica em base64
        file_content = file.read()
        encoded_string = base64.b64encode(file_content).decode('utf-8')

        return jsonify({"base64": encoded_string}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0')