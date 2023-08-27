# react-component-id-generator [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/main/LICENSE) 

This package will help simplify the interaction between the programmer and the automated tester.
Thanks to it, we can flexibly generate IDs in **all over the project at once**, so that the tester can easily locate elements on the web page.

The package works with React components with `.tsx` and `.jsx` extensions.

The result of the work will be the following changes:

_Initial component:_
```jsx
<button onClick={handleCancle}>cancel</button>
```

_Config:_
```json
"rules": [
  {
    "tag": "button",
    "pattern": "${componentName}_${tagName}_${attr:onClick}_someText"
  }
]
```

_Result component:_
```jsx
<button onClick={handleCancle} data_test-id="YourComponentName_button_handleCancle_someTex">cancel</button>
```


# Documentation

1. [Package Installation](#installation)
1. [Creating Configuration](#configuration)
1. [Adding Script to package.json](#run-command)
1. [Example](#example)


# Installation

```bash
npm i --save-dev react-components-id-generator
```

```bash
yarn add -D react-components-id-generator
```


# Configuration

Creating a JSON file with a custom name, for example "generator.config.json" in a convenient location within the application directory

```json
{
  "id_name": "data_test-id",
  "paths": ["./src/OurComponent"],
  "rules": [
    {
      "tag": "button",
      "pattern": "${componentName}_${tagName}_${attr:onClick}"
    }
  ]
}

```

## Description

### General:
| Key       | Type                                                               | Description|
| :---:     | :---:                                                              | --- |
| `id_name` | string                                                             | name of the generated ID |
| `action`  | "delete" <br /> "onlyCreate" <br /> "onlyUpdate" <br /> "createAndUpdate" <br /> undefined | this is optional value ("_createAndUpdate_" by default) <br> **create** - creates new IDs for those that do not have them (does not update existing ones) <br> **update** - updates existing IDs (does not create new ones) <br> **delete** - delete all IDs matching with 'id_name" <br> **createAndUpdate** - creates and updates IDs
| `paths`   | string[]                                                           | array of paths to the components where the generation needs to be performed, and it also works with folders |
| `rules`   | {tag, pattern}[]                                                   | rules Rules for generating the ID string |
| `tag`     | string \| string[]                                                 | tag name of the element to which the pattern will be applied. |
| `pattern` | string                                                             | pattern according to which the string will be generated. |

### Patterns:
| Key                | Description|
| :---:              | --- |
| `${fileName}`      | file name |
| `${componentName}` | component name (currently, if the component is anonymous, the value will be `undefined`). |
| `${tagName}`       | tag name |
| `${attr:onClick}`  | value of any specified attribute from the tag.In this example, it is "onClick". (currently, if the tag does not have the specified attribute, the value will be `undefined`). |

#### Calculated values
You can also use `someTextBefore__${fileName | componentName}__someTextAfter` construction
The first valid value will be selected

| values             | result |
| ---                | :---: |
| fileName = MyFileName.tsx <br /> componentName = MyComponentName | `someTextBefore__MyFileName__someTextAfter` |
| fileName = MyFileName.tsx <br /> componentName = undefined | `someTextBefore__MyFileName__someTextAfter` |
| fileName = undefined <br /> componentName = MyComponentName | `someTextBefore__MyComponentName__someTextAfter` |
| fileName = undefined <br /> componentName = undefined | `someTextBefore__undefined__someTextAfter` |

You can also set a default value by surrounding the value with quotes: `someTextBefore__${fileName | "defaultString"}__someTextAfter`

| values             | result |
| ---                | :---: |
| fileName = MyFileName.tsx | `someTextBefore__MyFileName__someTextAfter` |
| fileName = undefined  | `someTextBefore__defaultString__someTextAfter` |

# Run Command

In your package.json, add the following command to the "scripts" section:
```json
"comand_name": "npx react-components-id-generator --config [path to our config]"
```

If your config file is at the same level as the package.json, the command will look like this:
```json
"generate_ids": "npx react-components-id-generator --config generator.config.json"
```

> [!NOTE]
> As Babel compiles the React component differently than intended ([issue](https://github.com/babel/babel/issues/10674)), recommended combining the generation process with the “eslint” command in your project:
> ```json
> "generate_ids": "npx react-components-id-generator --config generator.config.json && eslint --fix ./src"
> ```


# Example

## Component Analysis

Let's take a user creation form component with **links**, **inputs**, and **buttons**.
Besides the standard HTML tags, the component also uses other components. Here's an example:

```jsx
const CreateUserForm = () => {
  const handleCancle = () => console.log('cancel');
  const handleCreate = () => console.log('create');

  return (
    <>
      <h1>Create User Form</h1>

      <a href="http.com" target="_blank">
        check our web site
      </a>

      <div className="personInfo">
        <input type="text" name="firstName" />
        <input type="text" name="lastName" />
        <input type="text" name="phoneNumber" />
        <input type="email" name="email" />
        <input type="password" name="password" />
        <CustomInput name="power" />
      </div>

      <CustomComponent customProp="anyString" />

      <div className="controls">
        <button onClick={handleCancle}>cancel</button>
        <CustomButton onClick={handleCreate}>create</CustomButton>
      </div>
    </>
  );
};
```

We need to verify the proper functioning of links, the correctness of field input, and button operations. Other layout elements like `h1` or `div` are not of interest to us.


## Creating Configuration

Create a file named `generator.config.json.`

1. choose the name for our generated ID, which is specified in the **id_name** field.
1. specify the paths to files or folders in the **paths** field.
1. create **rules** for generating the ID string based on **patterns**.

As a result, our configuration looks like this:

```json
{
  "id_name": "data_test-id",
  "paths": ["./src/CreateUserFormFoulder"],
  "rules": [
    {
      "tag": "a",
      "pattern": "${componentName}_link_${attr:href}"
    },
    {
      "tag": ["input", "CustomInput"],
      "pattern": "${componentName}_${tagName}_${attr:name}"
    },
    {
      "tag": "CustomComponent",
      "pattern": "${componentName}_${tagName}_${attr:customProp}"
    },
    {
      "tag": ["button", "CustomButton"],
      "pattern": "${componentName}_${tagName}_${attr:onClick}"
    }
  ]
}
```

You may notice that in the `a` tag pattern, an arbitrary string `"link"` is used instead of `${tagName}`, as it may be simpler to understand.


## Creating the Run Command

Following the advice given, don't forget to add [eslint](https://eslint.org/) at the end of the command line.

```json
"generate_ids": "npx react-components-id-generator --config generator.config.json && eslint --fix ./src"
```


## Generation Result

With the following file structure and by specifying the path to the CreateUserFormFolder, the generation will occur in all files inside and in all subfolders within this folder.

```
/src
  /CreateUserFormFolder
    CreateUserFormJSX.jsx
    CreateUserFormTSX.tsx
```

We can see the generation result in the console:

```bash
> my-app@0.1.0 generate_ids
> npx react-components-id-generator --config generator.config.json

IDs added to file src/CreateUserFormFoulder/CreateUserFormJSX.jsx.
IDs added to file src/CreateUserFormFoulder/CreateUserFormTSX.tsx.
```

As a result, our component will look like this:

```jsx
const CreateUserForm = () => {
  const handleCancle = () => console.log('cancel');
  const handleCreate = () => console.log('create');

  return (
    <>
      <h1>Create User Form</h1>

      <a href="http.com" target="_blank" data_test-id="CreateUserForm_link_http.com">
        check our web site
      </a>

      <div className="personInfo">
        <input type="text" name="firstName" data_test-id="CreateUserForm_input_firstName" />
        <input type="text" name="lastName" data_test-id="CreateUserForm_input_lastName" />
        <input type="text" name="phoneNumber" data_test-id="CreateUserForm_input_phoneNumber" />
        <input type="email" name="email" data_test-id="CreateUserForm_input_email" />
        <input type="password" name="password" data_test-id="CreateUserForm_input_password" />
        <CustomInput name="power" data_test-id="CreateUserForm_CustomInput_power" />
      </div>

      <CustomComponent customProp="anyString" data_test-id="CreateUserForm_CustomComponent_anyString" />

      <div className="controls">
        <button onClick={handleCancle} data_test-id="CreateUserForm_button_handleCancle">cancel</button>
        <CustomButton onClick={handleCreate} data_test-id="CreateUserForm_CustomButton_handleCreate">create</CustomButton>
      </div>
    </>
  );
};
```