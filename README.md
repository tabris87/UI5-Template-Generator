# UI5 Template "Engine"
A **"proof-of-concept"** project for [smithery](https://github.com/tabris87/smithery).
Have fun and play.

## Setup
Copy the project and install the dependencies as for all npm-packages.

## Using
Currently the UI5 Template Generator has two possible functionalities.
```bash
npm run create-config
```
which creates a configuration by using the smithery-configurator.

```bash
npm run build-template
```
starts the building process by selecting a available configuration or jumps to the smithry-configurator to create a new one. 
Restart the script to build this configuration afterwards.

## Project Setup

The Project consists of 4 folders, as well as the application starter **app.js**.

**configurations**: the storage for all created configurations of the project
**features**: all feature implementations of the project
**models**: different types of model representations(.dimacs, .png, .xml)
**customRules**: custom rules used by *smithery*, specific for this project

## Feature-Model
You can have a look at the feature model at ['model.png'](./model/model.png).

## Model statistics (complete)
- [#Features] 40 (5 abstract features)
- [#CTC's] 7
- [#Core-Features] 3
- [#Dead-Features] 0

- [#Configurations] 3012

## Model statistics (w/o project setups)
- [#Features] 28 (5 abstract features)
- [#CTC's] 4
- [#Core-Features] 3
- [#Dead-Features] 0

- [#Configurations] 251