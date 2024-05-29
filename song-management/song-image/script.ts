Array.from(document.querySelectorAll("ul.list.top_songs_list li")).map((el) => {
  const imageUrl = (el.querySelector("div.re.bgfix") as HTMLDivElement)?.style
    ?.backgroundImage;
  const songname = el.querySelector("p.t1")?.textContent;
  return { imageUrl, songname };
});
