import svgwrite
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def write_html_loader(name, title, largura, altura):
    with open(f'{name}.html', 'wt', encoding='utf-8') as f:
        f.write(f"""<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>{title}</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
            <style>
                body {{ text-align: center; }}
                #capture {{ display: inline-block; width: {largura}px; height: {altura}px; overflow: hidden; }}
            </style>
        </head>
        <body>
            <div id="capture">
                <img src="{name}.svg" alt="SVG Image"/>
            </div>
            <script>
                window.onload = function() {{
                    html2canvas(document.getElementById('capture'), {{ backgroundColor: 'transparent' }}).then(function(canvas) {{
                        var link = document.createElement('a');
                        link.href = canvas.toDataURL('image/png');
                        link.download = '{name}.png';
                        link.click();
                    }}).catch(function(error) {{
                        console.error('Error:', error);
                    }});
                }};
            </script>
        </body>
        </html>
        """)

def font_embedded(name):
    largura = 400
    altura = 200
    dwg = svgwrite.Drawing(name + '.svg', size=(largura, altura))

    # Embutir a fonte
    dwg.embed_font(name="Indie Flower", filename='back/py/BungeeShade-Regular.ttf')
    dwg.embed_stylesheet("""
    .flower14 {
        font-family: "Indie Flower";
        font-size: 14px;
    }
    """)

    # Adicionar texto ao SVG
    paragraph = dwg.add(dwg.g(class_="flower14"))
    paragraph.add(dwg.text("Font 'Indie Flower' embedded from local file system.", insert=(10, 40)))

    dwg.save()

def main():
    name = "font_embedded"
    font_embedded(name)

    # Configuração do Selenium
    options = Options()
    # ... (configurações do Chrome, like disabling pop-ups)

    driver = webdriver.Chrome(options=options)

    # Abrir o arquivo HTML no navegador
    driver.get(f"file:///media/guilherme/ArquivosLinux/Projetos/lojaCentral/{name}.html")

    # Esperar a página carregar completamente
    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.ID, "capture")))

    # Esperar um pouco mais para garantir que a imagem esteja carregada (optional)
    time.sleep(1000000000)  # Adjust the wait time as needed

    # Fechar o navegador manualmente (optional)
    # driver.quit()

if __name__ == '__main__':
    main()