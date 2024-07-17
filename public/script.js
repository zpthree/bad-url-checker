function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

async function copyTextToClipboard(e) {
  const button = e.currentTarget;
  const text = document.getElementById('bad-urls').innerText;

  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }

  navigator.clipboard.writeText(text).then(function() {
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

document.getElementById('copy-bad-urls').addEventListener('click', copyTextToClipboard);

/**
 * @param {Event} e
 * Listen for form submission and check the URLs
 */
document.getElementById('check-bad-urls').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const urlList = data.get('url_list').trim();

	const urlArray = urlList.split('\n');
  let i = 0;

  const progress = document.getElementById('progress');

  await Promise.all(urlArray.map(async url => {
    if (!url) return;

		try {
      const response = await fetch('/check-url', {
        method: 'POST',
        body: new URLSearchParams({ url }),
      });

      const json = await response.json();
      const { status } = json;

      i += 1;
      progress.style.width = `${(i / urlArray.length) * 100}%`;

      if (status !== 200) {
        const badUrls = document.getElementById('bad-urls');
        badUrls.innerHTML += `${url}<br>`;
        badUrls?.scrollTo(0, badUrls.scrollHeight);
      }
    } catch (error) {
      console.error(error);
    }
	}));
});