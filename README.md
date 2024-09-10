# boilerplate-dynamic-generator

## Description

**boilerplate-dynamic-generator** is a personal tool designed to generate boilerplates based on the technologies you wish to use in your projects. It simplifies the initial setup by offering an interface that allows you to choose from different technologies and options, while storing your preferences locally for future reuse.

## Objectives

- Create a personal tool to generate boilerplates tailored to the specific needs of a project.
- Enable the selection of front-end technologies (Bootstrap, Tailwind CSS, React) and back-end (Node.js with TypeScript or JavaScript).
- Use local JSON files instead of a database to store configurations so these can be adapted
- Generate each boilerplate in a temporary directory.
- Provide a system to save configurations in local storage for reuse across sessions. (MVP2)
- Offer the ability to submit suggestions directly on GitHub via Issues generated from the interface.

## Features

1. **Technology Selection**:
   - **CSS**: Bootstrap
   - **Languages**: CoffeeScript to generate the code / Javascript files
   - **Backend**: Node.js

2. **File and Configuration Management**:
   - Use **local JSON files** to manage configurations.
   - Each boilerplate is generated in a **temporary directory**
   - Ability to **choose libraries** to include in the boilerplate and modify the associated metadata.

3. **Configuration Saving**:
   - Configurations can be saved in **local JSON files** to avoid re-entering them with each new generation. (MVP1)
   - Configurations can be saved in **local storage** to avoid re-entering them with each new generation. (MVP2)

5. **Suggestions and Modifications**:
   - Users can submit proposals or suggestions through a **GitHub Issue**. A link to the GitHub project is provided to simplify this interaction.

6. **MVP2**:
   - Create a simple page providing a clean and minimalist user experience.

## Stack Used

- **Node.js** for the backend
- **CoffeeScript** for code writing
- **JSON** for local configuration storage
- **Bootstrap** for front-end design

## Deployment Guide

1. **Clone the Project**:
   ```bash
   git clone https://github.com/your-username/boilerplate-dynamic-generator.git
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Usage**:
   - Run the code via **node boilerplate.js** and select the technologies and libraries to include in the boilerplate.
   - Generate the boilerplate in a temporary directory.
   - Save the configuration in local storage if needed.

4. **Suggestions**:
   - Submit proposals via the homepage by creating a **GitHub Issue**.
