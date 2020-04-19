# Qt for Python Signals and Slots

::: tip TIP
本文翻译自[Qt for Python Signals and Slots - Qt Wiki](https://wiki.qt.io/Qt_for_Python_Signals_and_Slots)
:::

本页描述了Qt for Python中信号和插槽的使用。重点是说明使用所谓的新式信号和插槽，尽管传统的语法也作为参考。

这种新风格的主要目标是为Python程序员提供更多的Pythonic语法。

## 传统语法: SIGNAL() and SLOT()

QtCore.SIGNAL()和QtCore.SLOT()宏允许Python与Qt信号和插槽传递机制进行交互。这是使用信号和插槽的旧方法。

下面的示例使用来自QPushButton的众所周知的点击信号。connect方法具有非python友好语法。有必要通知对象，其信号（通过宏）和要连接的插槽。

```python
import sys
from PySide2.QtWidgets import QApplication, QPushButton
from PySide2.QtCore import SIGNAL, QObject

def func():
    print("func has been called!")

app = QApplication(sys.argv)
button = QPushButton("Call func")
QObject.connect(button, SIGNAL ('clicked()'), func)
button.show()                                                                                             

sys.exit(app.exec_())
```

## 新语法: Signal() and Slot()

新式使用不同的语法来创建和连接信号和插槽。 前面的示例可以重写为：

```python
import sys
from PySide2.QtWidgets import QApplication, QPushButton

def func():
 print("func has been called!")

app = QApplication(sys.argv)
button = QPushButton("Call func")
button.clicked.connect(func)
button.show()
sys.exit(app.exec_())
```

###  使用QtCore.Signal()

可以使用QtCore.Signal()类定义信号。Python类型和C类型可以作为参数传递给它。如果你需要重载它，只需将类型作为元组或列表传递。

除此之外，它还可以接收定义信号名称的命名参数名称。如果没有任何内容作为名称传递，则新信号将与分配给它的变量具有相同的名称。

下面的示例部分包含有关使用QtCore.Signal()的示例集合。

注意：应仅在继承自QObject的类中定义信号。这样，信号信息被添加到类QMetaObject结构中。

###  使用QtCore.Slot()

使用装饰器QtCore.Slot()分配和重载插槽。同样，要定义签名，只需传递类似QtCore.Signal()类的类型。与Signal()类不同，要重载函数，不要将每个变量作为元组或列表传递。相反，您必须为每个不同的签名定义一个新的装饰器。下面的示例部分将更清楚。

另一个区别是它的关键字。Slot()接受名称和结果。result关键字定义将返回的类型，可以是C或Python类型。name的行为与Signal()中的行为相同。如果没有任何内容作为名称传递，则新插槽将与正在装饰的功能具有相同的名称。

###  示例

以下示例说明了如何在PySide2中定义和连接信号和插槽。 给出了基本连接和更复杂的示例。

- Hello World示例：基本示例，显示如何将信号连接到没有任何参数的插槽。

  ```python
  import sys
  from PySide2 import QtCore, QtGui
  
  # define a function that will be used as a slot
  def sayHello():
   print 'Hello world!'
  
  app = QtGui.QApplication(sys.argv)
  
  button = QtGui.QPushButton('Say hello!')
  
  # connect the clicked signal to the sayHello slot
  button.clicked.connect(sayHello)
  button.show()
  
  sys.exit(app.exec_())
  ```

- 接下来，添加一些参数。 这是一个修改过的Hello World版本。 一些参数被添加到插槽中并创建一个新信号。

  ```python
  import sys                                                                  
  from PySide2.QtWidgets import QApplication, QPushButton                     
  from PySide2.QtCore import QObject, Signal, Slot                            
                                                                              
  app = QApplication(sys.argv)                                                
                                                                              
  # define a new slot that receives a string and has                          
  # 'saySomeWords' as its name                                                
  @Slot(str)                                                                  
  def say_some_words(words):                                                  
      print(words)                                                               
                                                                              
  class Communicate(QObject):                                                 
   # create a new signal on the fly and name it 'speak'                       
   speak = Signal(str)                                                        
                                                                              
  someone = Communicate()                                                     
  # connect signal and slot                                                   
  someone.speak.connect(say_some_words)                                         
  # emit 'speak' signal                                                         
  someone.speak.emit("Hello everybody!")
  ```

- 添加一些重载。 对前一个示例的一个小修改，现在重载了装饰器。

  ```python
  import sys                                                                  
  from PySide2.QtWidgets import QApplication, QPushButton                     
  from PySide2.QtCore import QObject, Signal, Slot                            
                                                                              
  app = QApplication(sys.argv)                                                
                                                                              
  # define a new slot that receives a C 'int' or a 'str'                      
  # and has 'saySomething' as its name                                        
  @Slot(int)                                                                  
  @Slot(str)                                                                  
  def say_something(stuff):                                                   
      print(stuff)                                                            
                                                                              
  class Communicate(QObject):                                                 
      # create two new signals on the fly: one will handle                    
      # int type, the other will handle strings                               
      speak_number = Signal(int)                                              
      speak_word = Signal(str)                                                  
                                                                              
  someone = Communicate()                                                     
  # connect signal and slot properly                                          
  someone.speak_number.connect(say_something)                                 
  someone.speak_word.connect(say_something)                                   
  # emit each 'speak' signal                                                  
  someone.speak_number.emit(10)                                               
  someone.speak_word.emit("Hello everybody!")
  ```

- 插槽过载和更复杂的信号连接和发射的示例：

  ```python
  import sys
  from PySide2.QtWidgets import QApplication, QPushButton
  from PySide2.QtCore import QObject, Signal, Slot
  
  app = QApplication(sys.argv)
  
  # define a new slot that receives a C 'int' or a 'str'
  # and has 'saySomething' as its name
  @Slot(int)
  @Slot(str)
  def say_something(stuff):
      print(stuff)
  
  class Communicate(QObject):
      # create two new signals on the fly: one will handle
      # int type, the other will handle strings
      speak = Signal((int,), (str,))
  
  someone = Communicate()
  # connect signal and slot. As 'int' is the default
  # we have to specify the str when connecting the
  # second signal
  someone.speak.connect(say_something)
  someone.speak[str].connect(say_something)
  
  # emit 'speak' signal with different arguments.
  # we have to specify the str as int is the default
  someone.speak.emit(10)
  someone.speak[str].emit("Hello everybody!")
  ```

- 发出信号的对象方法的示例：

  ```python
  import sys                                                                  
  from PySide2.QtCore import QObject, Signal                                  
                                                                              
  # Must inherit QObject for signals                                          
  class Communicate(QObject):                                                 
      speak = Signal()                                                        
                
      def __init__(self):                                                     
          super(Communicate, self).__init__()    
          self.speak.connect(self.say_hello)                             
                                                                              
      def speaking_method(self):                                              
          self.speak.emit()   
  
      def say_hello(self):
          print("Hello")                                                
  
                                                                              
  someone = Communicate()                                                 
  someone.speaking_method()
  ```

- 信号是实例拥有的运行时对象，它们不是类属性：

  ```python
  # Erroneous: refers to class Communicate, not an instance of the class
  Communicate.speak.connect(say_something)
  # raises exception: AttributeError: 'PySide2.QtCore.Signal' object has no attribute 'connect'
  ```

 