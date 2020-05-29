TemplateGenerator : Base CodeBase :: _TemplateGenerator ;

CodeBase : Navigation FirstPage [SecondPage] [ThirdPage] :: Application
	| Library ;

Navigation : Routing
	| NoRouting ;

Routing : Simple
	| MasterDetail
	| FlexibleColumnLayout ;

Simple : OnePage :: _Simple ;

OnePage : [TwoPage] :: _OnePage ;

TwoPage : [ThreePage] :: _TwoPage ;

MasterDetail : WithDummyDetail
	| WithEmptyDetail ;

FlexibleColumnLayout : TwoPageStartOne
	| MasterDetailType ;

FirstPage : [Pattern] :: _FirstPage ;

Pattern : Table
	| List
	| Worklist
	| Toolpage ;

SecondPage : [ObjectPageSecond] :: _SecondPage ;

ThirdPage : [ObjectPageThird] :: _ThirdPage ;

%%

NoRouting implies not (SecondPage or ThirdPage) ;
TwoPage implies SecondPage ;
ThreePage implies ThirdPage ;
MasterDetail implies FirstPage and SecondPage ;

