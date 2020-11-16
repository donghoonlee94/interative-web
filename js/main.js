(() => {
  let yOffset = 0; // window.pageYoffset
  let prevScrollHeight = 0; // Total previous scroll height
  let currentScene = 0; // Active scene
  let enterNewScene = false; // New scene enter === true

  const sceneInfo = [
    {
      type: "sticky",
      multiplyNum: 5,
      scrollHeight: 0,
      elements: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
      },
      values: {
        messageAOpacity: [0, 1],
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

    yOffset = window.pageYOffset;
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);
  };

  const calcValues = (values, currentYOffset) => {
    let rv;
    let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
    rv = scrollRatio * (values[1] - values[0]) + values[0];
    return rv;
  };

  const playAnimation = () => {
    const elements = sceneInfo[currentScene].elements;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;

    switch (currentScene) {
      case 0:
        let messageAOpacityIn = calcValues(
          values.messageAOpacity,
          currentYOffset
        );
        elements.messageA.style.opacity = messageAOpacityIn;

        break;

      case 1:
        break;

      case 2:
        break;

      case 3:
        break;
    }
  };

  const scrollLoop = () => {
    enterNewScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    const { scrollHeight } = sceneInfo[currentScene];

    if (yOffset > prevScrollHeight + scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return null;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (enterNewScene) return null;

    playAnimation();
  };

  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });
  window.addEventListener("load", setLayout);
  window.addEventListener("resize", setLayout);
})();
