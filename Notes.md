# Generierungsprobleme
## MasterDetailEmptyDetailOnStart

### App.view.xml
Die App view enthält 2 views. die erste sollte aber ersetzt werden.

### FirstPage.view.xml
Die View enthält 2 views, nur eine davon sollte exisiteren

### SecondPage.view.xml
- Die view enthält 2 views, nur eine davon sollte existieren
- Die zweite view enthält undefined content !!! woher???

## Problem
Das Problem liegt in der Benennung der XML Knoten, hier müssen wir den original xmlTree.name wegspeichern und dafür schauen das 
wir die Benennung der Knoten ähnlich zum Javascript oder JSON machen.