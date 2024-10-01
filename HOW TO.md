# Boilerplate Dynamic Generator

## 1. Introduction

The Boilerplate Dynamic Generator is a powerful tool designed to simplify the process of setting up new projects by generating custom boilerplates based on your specific technology preferences. This application allows you to select various front-end and back-end technologies, and generates a tailored project structure with the necessary configurations and dependencies.

The application uses Bootstrap for styling, providing a clean and responsive user interface.

## 2. Installation

To set up the Boilerplate Dynamic Generator, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/boilerplate-dynamic-generator.git
   ```

2. Navigate to the project directory:

   ```bash
   cd boilerplate-dynamic-generator
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## 3. Usage

To use the Boilerplate Dynamic Generator:

1. Start the application:

   ```bash
   node src/app.js
   ```

2. Open your web browser and navigate to `http://localhost:3000`.

3. You will see a form with various options for configuring your boilerplate. Select your desired technologies and options.

4. Click the submit button to generate your boilerplate.

5. The application will create a new boilerplate in the directory specified by the `boilerWorkingFolder` setting in the `src/boilerplate/boilerplateConfig.json` file.

## 4. Customization

### Adding New Templates

To add new technology options or customize existing ones:

1. Create a new JSON file in the `src/templates` directory (e.g., `newtech.json`).
2. Define the structure of the new technology option, including any necessary commands, npm packages, or file operations.
3. Create a corresponding HTML file (e.g., `newtech.html`) in the same directory to define the UI for selecting options related to this technology.
4. The application will automatically detect and include the new option in the generation process.

### Modifying Existing Templates

To modify existing templates:

1. Navigate to the `src/templates` directory.
2. Open the relevant JSON file (e.g., `frontend.json`, `backend.json`).
3. Modify the content to add, remove, or change options, commands, or file operations.
4. If necessary, update the corresponding HTML file to reflect changes in the UI.

### HTML Template Examples

The application uses HTML templates to create the user interface for selecting boilerplate options. Here are shortened examples of the existing templates:

#### Frontend Template (src/templates/frontend.html)

```html
<div class="row">
	<div class="container">
		<h2 id="frontend">Frontend</h2>
		<div class="m-3">
			<p>Select a Frontend framework</p>
			<div class="form-check form-check-inline">
				<input
					class="form-check-input option"
					type="radio"
					name="selectFrontend"
					id="reactjs"
					value="reactjs"
				/>
				<label class="form-check-label" for="reactjs"> ReactJS </label>
			</div>
			<!-- More frontend options... -->
		</div>
	</div>
</div>
```

#### Setup Template (src/templates/setup.html)

```html
<div class="row">
	<div class="container">
		<h2 id="setup">Setup Project</h2>
		<div class="m-3">
			<p class="fw-bold">Project Infos</p>
			<div>
				<label class="form-label" for="projectName">Project Name</label>
				<input
					class="form-control option"
					type="text"
					id="projectName"
					name="projectName"
					value="my-app"
				/>
			</div>
			<!-- More project info fields... -->
		</div>
		<div class="m-3">
			<p class="fw-bold">Select Modules</p>
			<p>This will change the type option in package-json</p>
			<div class="form-check form-check-inline">
				<input
					class="form-check-input option"
					type="radio"
					name="selectModule"
					id="esmodule"
					value="esmodule"
					checked
				/>
				<label class="form-check-label" for="esmodule">ES Modules </label>
			</div>
			<!-- More module options... -->
		</div>
		<!-- More setup options... -->
	</div>
</div>
```

These templates use Bootstrap classes for styling, ensuring a consistent and responsive layout. You can customize these templates or create new ones following a similar structure to add more options to your boilerplate generator.

## 5. Troubleshooting

If you encounter any issues:

- Check the console output for error messages.
- Ensure all dependencies are correctly installed.
- Verify that the paths in `boilerplateConfig.json` are correct.
- Check that you have the necessary permissions to write to the `boilerWorkingFolder` directory.

## 6. Contributing

Contributions to the Boilerplate Dynamic Generator are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear, descriptive messages.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

For major changes or new features, please open an issue first to discuss the proposed changes.

---

For any questions or support, please open an issue on the GitHub repository. Happy coding!
