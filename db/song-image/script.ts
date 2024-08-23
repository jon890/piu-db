Array.from(document.querySelectorAll("ul.list.top_songs_list li")).map((el) => {
  let imageUrl = (el.querySelector("div.re.bgfix") as HTMLDivElement)?.style
    ?.backgroundImage;

  imageUrl = imageUrl.substring(imageUrl.indexOf('"') + 1);
  imageUrl = imageUrl.substring(0, imageUrl.indexOf("?"));

  const songname = el.querySelector("p.t1")?.textContent;
  return { imageUrl, songname };
});
