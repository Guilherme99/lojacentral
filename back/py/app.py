from flask import Flask, request, send_file
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

def criar_svg(texto, estilo_texto, arquivo_saida='temp.svg'):
    largura = 400
    altura = 200
    dwg = svgwrite.Drawing(arquivo_saida, profile='tiny', size=(largura, altura))

    dwg.add(dwg.text(texto, insert=(largura / 2, altura / 2), **estilo_texto))
    dwg.add(dwg.text(texto, insert=(largura / 2, altura / 2), stroke='white', stroke_width='3', **estilo_texto))

    dwg.save()

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
    # Verifica se a chave 'pdf' está presente
    if 'base64' not in request.json:
        return "No PDF file provided", 400

    pdf_base64 = request.json['base64']

    # Verifica se a string base64 não está vazia
    if not pdf_base64:
        return "PDF base64 string is empty", 400

    try:
        pdf_data = base64.b64decode(pdf_base64)
    except Exception as e:
        return f"Error decoding base64: {str(e)}", 400

    # Criar um buffer a partir dos dados do PDF decodificado
    pdf_file = io.BytesIO(pdf_data)
    labels = request.json.get('labels', [])

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
            'fontFamily': 'Times-new-roman',
            'fontWeight': 'bold',
            'textAnchor': 'middle'
        })

        # Aplicando a conversão ao dicionário style
        style_snake_case = {camel_to_snake(key): value for key, value in style.items()}

        # Chame a função para criar e adicionar o SVG no PDF
        svg = 'temp.svg'
        criar_svg(texto, style_snake_case,svg)
        resultado_pdf = inserir_svg_no_pdf(pdf_file, svg, x, y, largura, altura, rotate)
        # Remover arquivos SVG gerados
        # os.remove(svg)

        # Atualiza pdf_file para o novo PDF
        pdf_file = resultado_pdf

    # Retorne o PDF final
    return send_file(pdf_file, mimetype='application/pdf', as_attachment=True, download_name='output.pdf')

if __name__ == '__main__':
    app.run(host='0.0.0.0')
