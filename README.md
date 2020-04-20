<h1 align="center">dorm-dashboard</h1>
<p align="center">
	<a href = "https://reactjs.org"><img src="https://img.shields.io/badge/Made with-React-23425C?logo=react"></a>
		<a href = "https://www.meteor.com"><img src="https://img.shields.io/badge/Made with-Meteor-D84D4D?logo=meteor"></a>
	<a href = "#"><img src="https://img.shields.io/badge/Powered by-Caffeine-6f4e37?logo=Buy-Me-A-Coffee"></a>
	<a href = "https://github.com/CS3249-gabrielfrancis/dorm-dashboard/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-informational"></a>
</p>

A mock temperature management system for a smart residential dormitory in NUS built using Meteor and React. This project was built as part of the final assignment for the CS3249 UI Development module at the National University of Singapore (NUS).
  

## Preview :sparkles:
<div align="center">
	<img src="https://raw.githubusercontent.com/CS3249-gabrielfrancis/dorm-dashboard/master/preview/wireframe.png" width="750">
</div>

<div align="center">
	<span><b>[TODO]</b> Current wireframe - Add animated gif later</span>
</div>

<h3 align="center"><a href="https://dorm-dashboard.herokuapp.com/">See the live interactive demo here! (Currently not working!)</a></h3>


## Getting started :space_invader:

If you are new to Meteor, install Meteor first by following this [quick start guide](https://guide.meteor.com).

To deploy this application locally, clone this repository onto your computer. Then, navigate to the folder where you cloned the repository. Then run the following commands in your command prompt/terminal:

### Install all dependencies
```
meteor npm install
```
### Run the local development build
```
meteor
```
The application will take a minute or two to initialize the mock data before you see this line:
```
...
=> App running at: http://localhost:3000
```
Visiting http://localhost:3000 in your browser then launch the app.
  
### Other Dependencies: 
* XState - [https://xstate.js.org/docs/](https://xstate.js.org/docs/)


## Implementation details :thinking:

**[TODO]**
Describe CSV Data loaded into backend MongoDB
```
# Describe schema
datas {
	...
}
```
Describe Data usage with Meteor and MiniMongo
Describe Dygraphs

The **floor plan** of "Floor 6" on the side of the app is connected with DyGraph instance. **Clicking on the rooms will toggle the temperature reading on the graph.** The colour of the rooms are also tied to the average temperature of the room shown on the graph compared to the global min and max temperatures recorded, with red for hotter temperatures and blue for colder temperatures. The intensity of the colours are also tied to deviation away from the average temperatures.  


## Documentation :book:
 

### File Structure


Here is the basic core folder structure of the Meteor app with description on what each file contains or does.
```
public/ 	# Fonts, Images, favicon, Web manifest files

private/	# Mock raw CSV data for the room temperature time-series data

server/		# Launch point for Meteor's server. 
			# The raw CSV data is formatted and handled here.
			
client/ 	# Main CSS for the application and the launch point for React

imports/
	api/ 	# Collection imported here for UI access
	ui/ 	# React Components
		...
```  

Most notably, this file structure allows Meteor to quickly recognise where relevant assets (client, server, public, etc) and closely follows the recommendations in [Meteor's official documentation](https://guide.meteor.com/structure.html#example-app-structure). 

To break down the `ui` folder structure further:
```
components/	# Stateless Components / UI logic
containers/	# Stateful Components / Presentation logic
data/		# Data processing utility functions / Business logic
```

React Components are split into *components* and *containers*, according to stateful _containers_ and "contained" stateless _components_. This architecture of containers and components allow for easy extensibility down the line as complex UI components can just be grouped and contained entirely within containers.

## License :pencil:

 This project is licensed under the MIT License - see the [LICENSE](https://github.com/CS3249-gabrielfrancis/dorm-dashboard/blob/master/LICENSE) file for details.
