JiZy.DropzoneConfig = {
	dictDefaultMessage: 'Déposer vos fichiers ici.<br />Limité à 10 fichiers de 5 Mo chacun.',
	dictFallbackMessage: 'Cette fonctionnalité n’est pas supportée par votre navigateur',
	dictFallbackText: 'Sélectionner un fichier',
	dictFileTooBig: 'Le fichier est trop volumineux ({{filesize}}Mo). Maximum: {{maxFilesize}}Mo.',
	dictInvalidFileType: 'Type de fichier non autorisé.',
	dictResponseError: 'Le serveur a répondu avec le code {{statusCode}}.',
	dictCancelUpload: 'Annuler',
	dictCancelUploadConfirmation: 'Voulez-vous vraiment annuler le téléchargement ?',
	dictMaxFilesExceeded: 'Vous avez la limite du nombre de téléchargements simultanés.',
	dictFileSizeUnits: { tb: "To", gb: "Go", mb: "Mo", kb: "Ko", b: "o" },
	acceptedFiles: 'image/png,image/jpeg,image/gif,application/pdf,.png,.jpg,.jpeg,.gif,.pdf',
	maxFilesize: 5,
	parallelUploads: 1,
	paramName: 'fileUploadName',
	url: '/user/file/dropzone/',
	onError: function(error, file){
		JiZy.messenger(file.name+': '+error, 'error', {
			persistant: false,
			timeout: 4
		});
	},
	onSuccess: function(file, response){
		if ( response.exception ){
			JiZy.messenger(response.exception, 'error', {
				persistant: false,
				timeout: 3
			});
		}
		else if ( response.error ){
			JiZy.messenger(response.error, 'error', {
				persistant: false,
				timeout: 3
			});
		}
		else if ( response.message ){
			JiZy.messenger(response.message, 'message', {
				persistant: false,
				timeout: 3
			});
		}
	}
};

if ( typeof Dropzone !== 'undefined' ){
	Dropzone.autoDiscover = false;
}
