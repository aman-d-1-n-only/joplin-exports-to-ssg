# Joplin Exports-To-SSG Plugin

This is a joplin plugin that exports collection of notes from [Joplin](https://joplinapp.org/) as markdown file along with their static files[ images , pdfs etc] to static site generator(ssg) project.

Currently it supports export to three static site generator -

- [Hugo](https://gohugo.io/)
- [Gatsby](https://www.gatsbyjs.com/)
- [Jekyll](https://jekyllrb.com/)

## How it can be useful for you ?

Let say you want to create your portfolio website -

1. Create note related to your site content in joplin or you can import notes exported from evernotes in joplin.

2. Then export your notes using this plugin.

3. Using any premade theme that your static site generator provides and your site is running up in minutes.

Joplin[ Create content as notes ] -----Export-----> SSG Project -------> Website

> **Conclusion** : It creates a great worklflow for building static webiste whoose main purpose is to display some infromation.

## Installation -

- Go to `Tools > Options > Plugins` .
- Search `Exports-To-SSG`.
- Click `Install` plugin.
- Restart Joplin app to enable it.

## How to use it ?

- Right click on notebook whoose notes you want to export.
  _Please keep in mind that notes which are at Level-1 Depth from selected notebook will be exported_.

> Level-1 Depth : To understand this scroll down to the `Some basic terminologies` section.

- Then a little menu will appear on your screen.Choose `Export to SSG` from there.

![Example-1](/images/example-1.png)

- After that a dialog will be going to appear pn your screen.Set the configuration and then export them.

  ![Example-2](/images/example-2.jpg)

> Warning ! : Don't press `Enter Key` while setting your export configuration because it will going to submit your form automatically. So don't try to type your front matter just directly paste your pre-typed front matter here in frontmatter option.

| Options         | Description                                                                     | Required |
| --------------- | ------------------------------------------------------------------------------- | -------- |
| Choose your SSG | It will decide how your notes will be exported                                  | Yes      |
| Project Path    | Provide the absolute path to the place where you want your notes to be exported | Yes      |
| Front Matter    | Paste your front matter you want to attach with each note                       | No       |

---

### What will be the structure of your exported content ?

Let us assume that your project is in a folder name root.

- For Hugo

  - All notes will be in a folder inisde your `root/content/NoteBook.title-NoteBook.id`.And note wil be named as their respective name in joplin. So notes are categorized according to their notebooks.

  - All the static file of these notes will under `root/static/resources` with their respective names as per in notes.

- For Gatsby

  - All notes will be in a folder inisde your `root/src/markdown`.And note wil be named `note.title-note.id`

  - All the static file of these notes will under `root/static` with their respective names as per in notes.

- For Jekyll

  - All notes will be in a folder inisde your `root/_posts`.And note will be named as `YYYY-MM-DD-note.title-note.id`

  - All the static file of these notes will under `root/resources`with their respective names as per in notes.

> Note : After exporting new path of static file are updated in notes as per instruction given by the ssg to deal with static file.After that you can change it accordingly.

## Some basic terminologies -

1. **SSG** - Static Site Generator
2. **Level-1 Depth** - You will click on notebook and this plugin exports all the notes at level-1 depth under this notebook not the subnotebooks and their notes.

Let us take one example of a notebook with 3 notes and 1 sub-notebook.Furthermore sub-notebook have 2 notes and 1 sub-sub-notebook.And this sub-sub-notebook also having 2 notes.

```
Notebook
|_ _ _Sub-Notebook
|       |_ _ _sub-note-1
|       |_ _ _sub-note-2
|       |_ _ _Sub-Sub-Notebook
|               |_ _ _sub-sub-note-1
|               |_ _ _sub-sub-note-2
|_ _ _note-1
|_ _ _note-2
|_ _ _note-3
```

If you use this exports on

- Notebook : note-1 , note-2 and note-3 will be exported.
- Sub-Notebook : sub-note-1 and sub-note-2 will be exported.
- Sub-Sub-Notebook : sub-sub-note-1 and sub-note-2 will be exported.
