import joplin from 'api';
import { MenuItemLocation } from 'api/types';


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

		/*******************Driver Code*******************/

		//---------respective command for main button
		await joplin.commands.register({
            name: 'staticSiteExporterDialog',
            label: 'Export to SSG',
            execute: async (folderId: string) => {

            },
		});
		
		//---------created main button[entry point to plugin]
		await joplin.views.menuItems.create('Export to SSG', 'staticSiteExporterDialog', MenuItemLocation.FolderContextMenu);
	},
});
