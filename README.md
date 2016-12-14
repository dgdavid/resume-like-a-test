# Résumé like a test

It is a script / utility to generate a PDF document from a YAML file. It has
been designed to make an unusual résumé (a.k.a _curriculum vitae_) that looks like a JavaScript test
output. It is possible to change slightly the design due to the configuration
file.

<p align="center">
 <img alt="jonh-doe-resume" src="./resume_like_a_test.png" />
</p>

## Why?

> **TL;DR**
> 
> I was bored and I decided to waste some time making something useless, just
> for fun and learning.

The truth is that this is totally unnecessary because I could have made my
résumé in a half the time or less, using other tools like [Inkscape](https://inkscape.org), a simple
word processor or a fake JavaScript test.

Even more, already exists better tools to make résumés from plain text files,
such as [JSON Resume](https://jsonresume.org/) or
[HackMyResume](https://github.com/hacksalot/HackMyResume).

But I decided that, as a software developer, I must  take the opportunity and
produce some code testing something new or different for me.

In the beginning the idea was to use
[HexaPDF](https://github.com/gettalong/hexapdf) Ruby library. But, after
reviewing its API ([release 0.1.0](https://github.com/gettalong/hexapdf/tree/REL_0_1_0)),
I found it a little difficult to have something working in a short period of
time. So, I decided to use [PDFKit](http://pdfkit.org/) , that was one of the
tools that I found while I was searching alternative libraries to write PDF
documents.


## Libraries and tools used

As you can see in the source code, this project make use of

* [PDFKit](http://pdfkit.org/) - A JavaScript PDF generation library for Node and
the browser.
* [yaml-js](https://github.com/connec/yaml-js) - Pure Javascript.
YAML loader and dumper, ported from PyYAML.
* [nerd-fonts](https://github.com/ryanoasis/nerd-fonts) - a project that
  attempts to patch as many developer targeted fonts as possible with a high
  number of additional glyphs (icons) - _The fonts were downloaded from there_.
* [standardJS](http://standardjs.com) - One JavaScript style guide to rule them all.
* [ES6doc](https://esdoc.org/) - a documentation generator for JavaScript(ES6) - _Only the notation, I didn’t generate the output_
* [babel](https://babeljs.io/) -
  [babel-preset-es2015](http://babeljs.io/docs/plugins/preset-es2015/) -
  [babel-transform-object-rest-spread](https://babeljs.io/docs/plugins/transform-object-rest-spread/) - _to use ES6 features_.
* [yarn](https://github.com/yarnpkg/yarn) - Fast, reliable, and secure dependency management.
* and, _of course_, [node](https://nodejs.org)

I also had to use [font converter](http://www.freefontconverter.com/) to
convert `.otf` fonts to `.ttf` for PDF compatibility with OSX.

## How to use

Simply clone the repo


```
git clone git@github.com:dgdavid/resume-like-a-test.git

```

install dependencies (assuming that you have `yarn` installed in your system;
you also can use `npm`)

```
yarn
```

copy the config and data YAML sample files

```
cp config.yaml{.sample,}

cp data.yaml{.sample,}
```

and use your desired config and data. Then, run the command

```
yarn generate
```

and wait until your PDF will be generated.

Sorry about this, but  I won’t document  the configuration options. Since it is
a dummy project, it has no  sense to spend more time in it.


If you want to use it, just play and [readthesource](http://hangouts.readthesource.io/) ;)

## Caveats

As I said before, this is a project made only for learning purposes and build,
in a complicated way I must admit, a particular version of my résumé. So, it
wouldn’t be weird to find bugs and unexpected behaviors.

Some stuff to take into account are

* `textWithLink` only supports one link per text. It would awesome to add support
  for unlimited links, but I only needed one per line.
* links in the footer and vertical texts does not render properly
