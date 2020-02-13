import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import _ from 'lodash';

class App extends Component {
  state = {
    stories: []
  }
  async getStories(){
   
    var cyberStories = [];

    const cyberStoryKeys = ['title', 'url', 'score', 'kids'];

    // Fetch top 500 stories from HackerNews
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(hackerTopStoriesResponse => hackerTopStoriesResponse.json())
      .then(hackerTopStoriesResponseJson => {
        
        // Fetch each story's details asynchronsly and wait for all to complete before sorting 
        Promise.all(
          hackerTopStoriesResponseJson.map(hackerNewsID =>
            fetch('https://hacker-news.firebaseio.com/v0/item/'+hackerNewsID+'.json').then(storyDetailsResponse => storyDetailsResponse.json())
          )
        ).then(hackerTopStories => {
        
        // Sort HankerNews stories by their score and select the top 30
        const sortedHackerTop30Stories = _.sortBy(hackerTopStories, 'score').reverse().slice(0, 30);
        
        // Filter through HackerNews story details and extract only the information needed for CyberNews
        sortedHackerTop30Stories.map((story)=> {

            const cleanHackerStory = Object.keys(story)
            .filter(key => cyberStoryKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = story[key];
              return obj;
            }, {});

            cyberStories.push(cleanHackerStory);

        });

        this.setState({ stories: cyberStories }); 
      })
    


    })
    .catch(console.log)
  }

  async componentDidMount() {
    this.getStories();
  }
  render() {
    return (
      <div className="container">
        <div className="col-xs-12">
        <h1>CyberNews</h1>
        <div className="news-container">

          {this.state.stories.map((story) => (
              <div key={story.storyID} className="story-container card" onClick={()=> window.open(story.url, "_blank")} >
                <div className="story card-body">
                <h5 className="story-title card-title">{story.title}</h5>
                <h6 className="story-commment-1 card-subtitle mb-2 text-muted">
                  <span>{story.score}</span>
                  <span>{story.deleted}</span>

                </h6>
              </div>
              </div>
          ))}
        </div>

        </div>
       </div>
    );
  }
}

export default App;
