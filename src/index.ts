import joplin from 'api';
import { MenuItemLocation } from 'api/types';

const fs = (joplin as any).require('fs-extra');
const path = require('path');

//---------creates title for note as required in jekyll
function titleCreator( title : string ) {
	let today = new Date();
	let fPart = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '-';
	let sPart = title.split(' ').join('-');
	return (fPart + sPart);
}

//---------collecting and transfering the static file
async function resourceFetcher( note  , resourceDir : string , destPath : string  ) {
	const { items } = await joplin.data.get(['notes', note.id, 'resources']);
	items.forEach(resource => {
		const ext = resource.title.split('.')[1];
		const srcPath = path.join( resourceDir, `${resource.id}.${ext}`);
		const dest_Path = path.join( destPath , resource.title  )
		fs.copyFile(srcPath, dest_Path, (err) => {
			if (err) {
				console.log(err);
				alert('Some issue with exporting static files.');
				return;
			} else {
				// note.body.replace( resource.id , `/resources/${resource.title}`);
			}	
		});
	});
};

joplin.plugins.register({
	onStart: async function () {

		const resourceDir = await joplin.settings.globalValue('resourceDir');

		/*******************Dialog Configurations*******************/
		const dialogs = joplin.views.dialogs;
		const ssg_dialog = await dialogs.create('SSG-Dialog');

		//---------setting dailog UI
		await dialogs.setHtml(ssg_dialog, `
		<div class="dialog" >
			<div class="dialog-header">
				<h2>Static Website Generator</h2>
			</div>
			<div class="dialog-main">
				<form id="swg-form" name="basic_info">
            	    <div class="field">
            	        <label for="ssg">Choose your SSG (<span>*required</span>) </label>
					    <select name="ssg" id="ssg">
  				  	    	<option value="hugo">Hugo</option>
  				  	    	<option value="gatsby">Gastby</option>
  				  	    	<option value="jekyll">Jekyll</option>
					    </select>
            	    </div>

            	    <div class="field">
            	        <label for="dest_Path"> Project Path (<span>*required</span>) </label>
					    <input id="dest_Path" type="text" name="dest_Path" required autocomplete placeholder="Paste the absolute path" />   
            	    </div>
            	    <div class="field">
					    <label for="frontMatter" >Front Matter (<span>optional</span>) </label>
					    <textarea id = "frontMatter" rows = 10 cols="20" name="frontMatter" autocomplete ></textarea>
            	    </div>
				</form> 
			</div>
		</div>
		`);

		//---------add the css file for form
		await dialogs.addScript(ssg_dialog, './form.css');

		//---------setting controls of dialog
		await dialogs.setButtons(ssg_dialog, [
			{
				id: 'submit',
				title : 'Export',
			},
			{
				id: 'cancel',
				title:'Cancel'
			}
		]);

		/*******************Exporting Code*******************/
		await joplin.commands.register({
            name: 'exportingProcedure',
			execute: async (...args) => {
				
				//---------prequesite variables
				let ssg = args[1].basic_info.ssg;
				let dest_Path = args[1].basic_info.dest_Path;
				let frontMatter = args[1].basic_info.frontMatter;
				const basketFolder = await joplin.data.get(['folders', args[0]], { fields: ['id', 'title', 'body'] });
				const { items } = await joplin.data.get(['notes'], { fields: ['id', 'title', 'body', 'parent_id'] });
				const filteredNotes = items.filter( note => {
					return (note.parent_id === args[0]);
				});


				//----------check for the absolute path
				if (path.isAbsolute(dest_Path)) {
					if (ssg === 'hugo') {
						//---------handle exporting into hugo
						const folderName = basketFolder.title + '-' + basketFolder.id ;
						await fs.mkdirp(path.join(dest_Path, 'content', folderName));

						await fs.mkdirp( path.join( dest_Path ,'static', 'resources' ) );
						const resourceDestPath = (path.join(dest_Path, 'static', 'resources'));

						filteredNotes.forEach(async note => {
							await resourceFetcher( note , resourceDir , resourceDestPath );
							note.body = frontMatter + '\n' + note.body;
							fs.writeFile(path.join(dest_Path, 'content', folderName, `${note.title}.md`), note.body);
						});

					} else if (ssg === 'gatsby') {
						//---------handle exporting into gatsby
						await fs.mkdirp(path.join(dest_Path, 'src', 'markdown'));

						await fs.mkdirp( path.join( dest_Path ,'static', 'resources' ) );
						const resourceDestPath = (path.join(dest_Path, 'static', 'resources'));

						filteredNotes.forEach( async note => {
							await resourceFetcher( note , resourceDir , resourceDestPath );
							note.body = frontMatter + '\n' + note.body;
							fs.writeFile(path.join(dest_Path, 'src', 'markdown', `${note.title}-${note.id}.md`), note.body);
						});
					} else if (ssg === 'jekyll') {
						//---------handle exporting into gatsby
						fs.readdir(path.join(dest_Path, '_posts'), async (err, files) => {
							if (err) {
								await fs.mkdirp( path.join( dest_Path , '_posts' ) );
							}

							await fs.mkdirp(path.join(dest_Path, 'resources'));
							const resourceDestPath = (path.join(dest_Path , 'resources'));
							
							filteredNotes.forEach( async note => {
								await resourceFetcher( note , resourceDir , resourceDestPath );
								note.body = frontMatter + '\n' + note.body;
								note.title = titleCreator(note.title);
								fs.writeFile(path.join(dest_Path , '_posts' , `${note.title}-${note.id}.md`), note.body);
							});
						});

                	}
				} else {
					alert('Provided path is not valid !');
				}

            },
        });
		/*******************Driver Code*******************/

		//---------respective command for main button
		await joplin.commands.register({
            name: 'staticSiteExporterDialog',
            label: 'Export to SSG',
            execute: async (folderId: string) => {
				const { id, formData } = await dialogs.open(ssg_dialog);
                if ( id == "submit") {
                    await joplin.commands.execute('exportingProcedure', folderId , formData);
                }
            },
		});
		
		//---------created main button[entry point to plugin]
		await joplin.views.menuItems.create('Export to SSG', 'staticSiteExporterDialog', MenuItemLocation.FolderContextMenu);
	},
});
