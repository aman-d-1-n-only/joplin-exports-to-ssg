import joplin from 'api';
import { MenuItemLocation } from 'api/types';

const fs = (joplin as any).require('fs-extra');
const path = require('path');

joplin.plugins.register({
	onStart: async function () {

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
            	        <label for="swg">Choose your SWG (<span>*required</span>) </label>
					    <select name="swg" id="swg">
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
				let swg = args[1].basic_info.swg;
				let dest_Path = args[1].basic_info.dest_Path;

				//----------check for the absolute path
				if (path.isAbsolute(dest_Path)) {
					if (swg === 'hugo') {
						//---------handle exporting into hugo

					} else if (swg === 'gatsby') {
						//---------handle exporting into gatsby

					} else if (swg === 'jekyll') {
						//---------handle exporting into gatsby

                	}
				} else {
					alert(' Path is incorrect! ');
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
