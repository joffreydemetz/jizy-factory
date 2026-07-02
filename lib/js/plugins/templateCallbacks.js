JiZy.Template.addResponseCallbacks((data) => {
	document.addEventListener('DOMContentLoaded', () => {
		if (data.obfuscated) {
			JiZy.Unobfuscate(data.obfuscated);
		}
	});
});
