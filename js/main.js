(() => {
  let yOffset = 0; // window.pageYoffset
  let totalPrevScrollHeight = 0; // Total previous scroll height
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
        messageAOpacityIn: [0, 1, { start: 0.1, end: 0.2 }],
        meesageATranslateYIn: [20, 0, { start: 0.1, end: 0.2 }],
        messageAOpacityOut: [1, 0, { start: 0.25, end: 0.3 }],
        meesageATranslateYOut: [0, -20, { start: 0.25, end: 0.3 }],
        messageBOpacityIn: [0, 1, { start: 0.3, end: 0.4 }],
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
    const { scrollHeight } = sceneInfo[currentScene];
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;
      // console.log("partScrollStart", partScrollStart);
      // console.log("partScrollEnd", partScrollEnd);
      // console.log("partScrollHeight", partScrollHeight);
      // console.log("currentYOffset", currentYOffset);
      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        // 현재 스크롤 값 - 부분 스크롤 값의 시작 지점 / 부분 스크롤 전체 값 + 적용할  영역의 총 수치 ((end - start) + start)
        rv =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset < partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  };

  const playAnimation = () => {
    const elements = sceneInfo[currentScene].elements;
    const values = sceneInfo[currentScene].values;
    // currentYOffset === window scroll - total prev section height
    const currentYOffset = yOffset - totalPrevScrollHeight;
    const currentSceneScroll = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / currentSceneScroll;

    switch (currentScene) {
      case 0:
        const messageAOpacityIn = calcValues(
          values.messageAOpacityIn,
          currentYOffset
        );
        const messageAOpacityOut = calcValues(
          values.messageAOpacityOut,
          currentYOffset
        );
        const meesageATranslateYIn = calcValues(
          values.meesageATranslateYIn,
          currentYOffset
        );
        const meesageATranslateYOut = calcValues(
          values.meesageATranslateYOut,
          currentYOffset
        );
        console.log("scrollRatio", scrollRatio);
        if (scrollRatio <= 0.22) {
          elements.messageA.style.opacity = messageAOpacityIn;
          elements.messageA.style.transform = `translateY(${meesageATranslateYIn}%)`;
        } else {
          elements.messageA.style.opacity = messageAOpacityOut;
          elements.messageA.style.transform = `translateY(${meesageATranslateYOut}%)`;
        }

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
    totalPrevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      totalPrevScrollHeight += sceneInfo[i].scrollHeight;
    }

    const { scrollHeight } = sceneInfo[currentScene];

    if (yOffset > totalPrevScrollHeight + scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (yOffset < totalPrevScrollHeight) {
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
