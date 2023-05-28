from PyQt6.QtCore import QUrl
from PyQt6.QtWidgets import QMainWindow, QApplication
from PyQt6.QtWebEngineWidgets import QWebEngineView

import sys

class MainWindow(QMainWindow):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # 设置窗口标题
        self.setWindowTitle('学习宝')
        # 设置浏览器
        self.browser = QWebEngineView()
        url = 'http://192.168.1.7:6688'
        # 指定打开界面的 URL
        self.browser.setUrl(QUrl(url))
         # 添加浏览器到窗口中
        self.setCentralWidget(self.browser)
        self.showMaximized()

# 创建应用
app = QApplication(sys.argv)
# 创建主窗口
window = MainWindow()
# 显示窗口
window.show()
# 运行应用，并监听事件
app.exec()