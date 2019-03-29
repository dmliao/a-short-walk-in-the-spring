# a short walk in the spring

Source code for a partially-generated Twine game. Written in Javascript and Python, and compiles to Twine 1.4.

## Installing Dependencies

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

## Compiling Script

Once all the dependencies have been installed, run

```
npm run build
```

The result will be compiled as a Twine 1.4 `twee` file at `./bin/output.twee`.

## Creating HTML Game

You should be able to open up `output.twee` in Twine 1.4 (NOTE: this is the older version - I have not tested this on Twine 2!). The preview of the passages will probably be a righteous mess, but you should be able to preview and build the game just like any other game in Twine.