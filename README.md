# a short walk in the spring

Source code for a partially-generated Twine game. Written in Javascript and Python, and compiles to Twine 1.4.

The project was originally conceptualized as a [Nanogenmo](https://nanogenmo.github.io/) entry back in November 2016, and was not initially meant to be interactive. However, the different pieces ended up having a natural interactive element to them, and so the project was converted into a Twine game.

---

## Just Looking Around?

The entry point of the program is `main.js`, which dictates the structure of the entire story. A 'chapter' of the story consists of one journey and the result, and by default the main story generates 5 chapters before finishing the story.

Most of the code to procedurally generate the passages are in `travel-route.js`, which is probably the most interesting file in this source. It contains both all of the predefined phrases, sentences and combinations used to create the game's traveling sections, as well as the logic to put them together.

(`home.js` and `destination.js` contain all of the other generative code, though those sections are considerably simpler than the sections in `travel-route.js`)

## Compiling the Game

Running the program will produce a Twine 1.4-compatible twee file. It will technically be a unique 'game', but will be practically identical in content to other games produced by this program.

### Installing Dependencies

Make sure you have a recent version of Node.JS and Python (64bit) installed on your computer.

Install Node.JS dependencies with npm:

```
npm install
```

Install Python dependencies with pip:

```
pip install chatterbot==0.4.13
```

Note the version number for chatterbot; more recent versions of chatterbot removed the JSON adapter, breaking the program.

On Windows, you may receive an `error: Microsoft Visual C++ 14.0 is required. Get it with "Microsoft Visual C++ Build Tools"` message. If so, download and install the Visual C++ vuild tools here: https://visualstudio.microsoft.com/visual-cpp-build-tools/

### Compiling Script

Once all the dependencies have been installed, run

```
npm run build
```

The result will be compiled as a Twine 1.4 `twee` file at `./bin/output.twee`.

### Creating HTML Game

You should be able to open up `output.twee` in Twine 1.4 (NOTE: this is the older version - I have not tested this on Twine 2!). The preview of the passages will probably be a righteous mess, but you should be able to preview and build the game just like any other game in Twine.

---

## Design

The story is about a person whose closest friend passed away, and learned that the friend’s ghost would manifest in certain locations at flower patches. The narrator then travels to those locations, possibly wandering astray, and speaks to the ghost.

The concept is similar to a lot of Nanogenmo entries in that it’s about a traveler, and a bulk of generation is on the world that the traveler explores. Once the story evolved into interactive fiction, the general flow was:

1.  Go to a destination and generate a route. 
2.  You always have a choice whether to press onwards, or wander. 
a.  If you press onwards, you get closer and closer to the destination until you arrive
b.  If you wander, the world gets more and more surreal
c.  Every time you wander, you have to spend the same amount of time to get back on track.
3.  If you get lost for a long time, (more than twice the distance to get there), you end up getting lost and going home.
The content is partly handwritten, partly generated. Most of the sentences are written as templates, where the verbs and some of the sentence are pre-written, with nouns and adjectives filled in from context or from word banks. In code, content generation was separated into four distinct areas: presets, home, destinations, and the route.

## Presets

This part of the code handled the prose that was entirely prewritten and static, particularly the first scene, the ending, and the passage for getting lost.

### Home

The area that the narrator returns to between trips. The main generated part here is that there is a visitor, whose name and gender are randomly generated. The actions this visitor can take are pre-written, but the action that is selected for that scene is chosen randomly by the computer.

### Destinations

The name and type of the destination are generated, but the general sentences are handwritten, save for the dialogue section.

The dialogue section at the destination (when the narrator summons the ghost) relies on a chatbot . The narrator’s dialogue is randomly selected from a few sentences, fed into the chatbot, and a sort of nonsensical dialogue follows. 

### Routes

Routes are almost entirely generated text, and the character travels along the route to the destination. The generator has an invisible ‘distance’ variable, which determines how many interactions are needed to reach the destination: the narrator starts either 2, 3, or 4 units away from the destination, and a generated passage describing the scenery is presented. Each passage on the route has two choices: press onwards decreases distance by 1, and if distance hits 0, then the narrator arrives at the destination. Wander increases distance by 1.

Each time a passage is displayed, a timer increases by 1. If the timer hits 10, the narrator gets hopelessly lost, gives up and goes home. This is only possible if the narrator has wandered a few times.
The passages themselves also vary based on distance. At its baseline, the passage describes the path the narrator is traveling, and possibly terrain and weather if they have changed. At around distance 3 and 4, the narrator begins describing the surroundings a bit more in detail, the generator drawing from a bank of premade objects or large landmarks. By distance 5 and 6, the details become more surreal, and start pulling adjectives and nouns from a larger dataset that may no longer match the environment.

### Ending

There are three endings, depending on how many destinations were reached successfully. All of them are handwritten.

### On Generation

For the most part, sentence structure, narrative structure, and even whole passages are handwritten, with generated content mostly relegated to individual words within sentences, or choosing where to place those sentences. None of the plot points or story elements are created from machine generation. 

Because of the branching narrative, there’s the fact that a great deal of what’s generated will not be read. The whole story generated is roughly ~200 passages, many of them for the various paths on the routes that are not taken. However, generation is still rather structured, so the parts that are left unread will not feel terribly unique, even though they technically are unique.
 
