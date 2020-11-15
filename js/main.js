(() => {
  const sceneInfo = [
    {
      type: "sticky",
      multiplyNum: 5,
      scrollHeight: 0,
      elements: {
        container: document.querySelector("#scroll-section-0"),
      },
    },
    {
      type: "normal",
      multiplyNum: 5,
      scrollHeight: 0,
      elements: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      type: "sticky",
      multiplyNum: 5,
      scrollHeight: 0,
      elements: {
        container: document.querySelector("#scroll-section-2"),
      },
    },
    {
      type: "sticky",
      multiplyNum: 5,
      scrollHeight: 0,
      elements: {
        container: document.querySelector("#scroll-section-3"),
      },
    },
  ];

  const setLayout = () => {
    for (let i = 0; i < sceneInfo.length; i++) {
      const { multiplyNum } = sceneInfo[i];
      const { container } = sceneInfo[i].elements;
      sceneInfo[i].scrollHeight = multiplyNum * window.innerHeight;
      container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }
  };

  window.addEventListener("resize", setLayout);

  setLayout();
})();
