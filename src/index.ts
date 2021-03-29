import joplin from 'api';
import { MenuItemLocation } from 'api/types';


joplin.plugins.register({
	onStart: async function() {
		
		/*******************Driver Code*******************/

		//---------respective command for main button
		await joplin.commands.register({
            name: 'staticSiteExporterDialog',
            label: 'Export to SSG',
            execute: async (folderId: string) => {
				console.log('Successfully created a entry point button and associated a command with it.')
            },

		});
		
		//---------created main button[entry point to wh]
		await joplin.views.menuItems.create('Export to SSG', 'staticSiteExpoterDialog', MenuItemLocation.FolderContextMenu);
	},
});
