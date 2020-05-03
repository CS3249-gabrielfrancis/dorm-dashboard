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
	<img src="https://raw.githubusercontent.com/CS3249-gabrielfrancis/dorm-dashboard/master/preview/Preview.png" width="750">
</div>

<div align="center">
	<span><b>Exploring time series data in an interactive and visually enjoyable way.</b></span>
</div>

<div align="center">
  <figure style="display: inline-block;"><img src="https://raw.githubusercontent.com/CS3249-gabrielfrancis/dorm-dashboard/master/preview/gif/DateTime.gif" width="310">
   <figcaption><b>Adjust the time window</b></figcaption>
 </figure>
 <figure style="display: inline-block;"><img src="https://raw.githubusercontent.com/CS3249-gabrielfrancis/dorm-dashboard/master/preview/gif/SampleSize.gif" width="310">
   <figcaption><b>Adjust the granularity of your sample</b></figcaption>
 </figure>
 </div>
 <div align="center">
 <figure style="display: inline-block;"><img src="https://raw.githubusercontent.com/CS3249-gabrielfrancis/dorm-dashboard/master/preview/gif/FloorPlan.gif" width="310">
   <figcaption><b>Filter your data by using the Floor Plan</b></figcaption>
 </figure>
 <figure style="display: inline-block;"><img src="https://raw.githubusercontent.com/CS3249-gabrielfrancis/dorm-dashboard/master/preview/gif/ScrollPan.gif" width="310">
   <figcaption><b>Scrolling to zoom, Dragging to pan, easy!</b></figcaption>
 </figure>
</div>

<h3 align="center"><a style="
  border-style: solid;
  border-width : 1px 1px 1px 1px;
  text-decoration : none;
  padding : 10px;
  border-color : #081F4E;
  background: #081F4E;
  color: #FFFFFF;
  border-radius: 5px;
" href="https://dorm-dashboard.herokuapp.com/">See the live Heroku deployment demo here!</a></h3>


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
components/	# Stateless Components - UI logic
containers/	# Stateful Components - Presentation logic
data/		# Data processing utility functions - Business logic
```

React Components are split into *components* and *containers*, according to stateful _containers_ and "contained" stateless _components_. This architecture of containers and components allow for easy extensibility down the line as complex UI components can just be grouped and contained entirely within containers.

## Implementation details :thinking:

The temperature time series data in this application is provided to us in a form of a CSV file (`/private/room-temperatures.csv`) with the following (parsed) schema:

```
# Old temperature time series schema
const tempObject = {
    roomId: 6,
    data: new Date("2013-10-02T05:00:00"),
    temperature: 23.112
};
```
However, this schema represents each time series data at its most atomic level, which presents performance issues when plotting all the points in the graph, given that there can be up to thousands of points!

Thus, the server upon startup, will treat the parsed CSV data into a format where we aggregate room data according to common timings. This reduces the amount of data objects we need to load into the database and send to the frontend. Like so:

```
# Treated temperature time series schema
const tempObject = {
	date: new Date("2013-10-02T05:00:00"),
    room Temps:. {
        room0: 22.329,
        room1: 20.615,
        room2: 20.415,
        room3: 20.612,
        room4: 19.121,
        room5: 25.123,
        room6: 21.111
    }
}
```

Using Meteor, our front React Application can seamlessly interact with our backend datastore (MongoDB) as the data is published from the back end as a topic which is subscribed to by the frontend graph interface. The received data is then filtered according to the parameters set by the user. For our graph interface, we used [Dygraphs](http://dygraphs.com) due to its lightweight footprint and simple-to-use API.

The **floor plan** of "Floor 6" on the side of the app is connected with DyGraph instance. Clicking on the rooms will toggle the temperature reading on the graph. The colour of the rooms are also tied to the average temperature of the room shown on the graph compared to the global min and max temperatures recorded, with red for hotter temperatures and blue for colder temperatures. The intensity of the colours are also tied to deviation away from the average temperatures.  

## License :pencil:

 This project is licensed under the MIT License - see the [LICENSE](https://github.com/CS3249-gabrielfrancis/dorm-dashboard/blob/master/LICENSE) file for details.
