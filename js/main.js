(() => {
  let yOffset = 0; // window.pageYoffset
  let totalPrevScrollHeight = 0; // 이전 섹션의 높이 총 합
  let currentScene = 0; // 현재 섹션
  let enterNewScene = false; // 새로운 섹션 진입 시에만 true 변경

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
        canvas: document.querySelector("#video-canvas-0"),
        context: document.querySelector("#video-canvas-0").getContext("2d"),
        videoImages: [],
      },
      values: {
        videoImageCount: 300,
        imageSequence: [0, 299],
        canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
        messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
        messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
        messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
        messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
      },
    },
    // type = position
    // multiplyNum = section height * multyplyNum
    // scrollHeight = section height
    // element = section or interative tag
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
        messageA: document.querySelector("#scroll-section-2 .a"),
        messageB: document.querySelector("#scroll-section-2 .b"),
        messageC: document.querySelector("#scroll-section-2 .c"),
        pinB: document.querySelector("#scroll-section-2 .b .pin"),
        pinC: document.querySelector("#scroll-section-2 .c .pin"),
        canvas: document.querySelector("#video-canvas-1"),
        context: document.querySelector("#video-canvas-1").getContext("2d"),
        videoImages: [],
      },
      values: {
        videoImageCount: 959,
        imageSequence: [0, 959],
        canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
        canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
        messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
        messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
        messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
        messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
        messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
        messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
        messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
        messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
        messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
        messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
        messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
        messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
        pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
        pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }],
      },
    },
    {
      type: "sticky",
      multiplyNum: 5,
      scrollHeight: 0,
      elements: {
        container: document.querySelector("#scroll-section-3"),
        canvasCaption: document.querySelector(".canvas-caption"),
      },
    },
  ];

  const setCanvasImages = () => {
    let image;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      image = new Image();
      image.src = `001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].elements.videoImages.push(image);
    }
    let image2;
    for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
      image2 = new Image();
      image2.src = `002/IMG_${7027 + i}.JPG`;
      sceneInfo[2].elements.videoImages.push(image2);
    }
  };
  setCanvasImages();

  const setLayout = () => {
    // 모든 섹션의 수만큼 for문을 실행하여, 각 객체안에 scrollHeight 값에
    // window.innerHeight 값 * multyplyNum 을 주입함.
    // container의 height 값에 해당 값을 주입.

    for (let i = 0; i < sceneInfo.length; i++) {
      const { multiplyNum } = sceneInfo[i];
      const { container } = sceneInfo[i].elements;
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = multiplyNum * window.innerHeight;
      } else if (sceneInfo[i].type === "normal") {
        sceneInfo[i].scrollHeight = container.offsetHeight;
      }
      container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    // 초기 laod시 변수 yOffset에 window.pageYoffset 값을 설정
    // 모든 섹션의 수만큼 for문을 실행하나, 현재 스크롤의 높이 값이
    // 주입된 총 섹션의 height 값보다 낮아질 경우 현재 신을 i 값으로
    // 설정한 후 break한다. 그리고 body에 id 주입.

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

    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].elements.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    sceneInfo[2].elements.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
  };

  const calcValues = (values, currentYOffset) => {
    // scrollRatio = 현재 스크롤에서의 높이 값 / 섹션의 높이 값
    let rv;
    const { scrollHeight } = sceneInfo[currentScene];
    const scrollRatio = currentYOffset / scrollHeight;

    // values의 길이가 3이라면 해당 엘리먼트의 시작 지점과 끝 지점이 있는 것.
    if (values.length === 3) {
      // partScrollStart = 0.1부터 시작이고 현재 섹션의 높이가 4000이면, 그의 10%인 400.
      // partScrollEnd = 0.2가 끝이고 현재 섹션의 높이가 4000이면, 그의 20%인 800.
      // partScrollHeight = end가 800이고 start 400이면 그 사이의 값. 400
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;
      // console.log("partScrollStart", partScrollStart);
      // console.log("partScrollEnd", partScrollEnd);
      // console.log("partScrollHeight", partScrollHeight);
      // console.log("currentYOffset", currentYOffset);
      // console.log("scrollRatio", scrollRatio);
      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        // (현재 섹션의 스크롤 값 - 시작할 부분 스크롤 값) =  / 부분 스크롤 전체 값 + 적용할  영역의 총 수치 ((end - start) + start)
        // 현재 마우스 높이가 500, 스타트 지점이 400, 총 부분 높이가 400이면
        // 100 / 400 = 0.25
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
        // console.log(scrollRatio);/
        let sequence = Math.round(
          calcValues(values.imageSequence, currentYOffset)
        );
        elements.context.drawImage(elements.videoImages[sequence], 0, 0);
        elements.canvas.style.opacity = calcValues(
          values.canvas_opacity,
          currentYOffset
        );

        if (scrollRatio <= 0.22) {
          // in
          elements.messageA.style.display = "block";
          elements.messageA.style.opacity = calcValues(
            values.messageA_opacity_in,
            currentYOffset
          );
          elements.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          elements.messageA.style.display = "block";
          elements.messageA.style.opacity = calcValues(
            values.messageA_opacity_out,
            currentYOffset
          );
          elements.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_out,
            currentYOffset
          )}%, 0)`;
        }
        if (scrollRatio >= 0.32) {
          elements.messageA.style.display = "none";
        }
        if (scrollRatio <= 0.42) {
          // in
          elements.messageB.style.opacity = calcValues(
            values.messageB_opacity_in,
            currentYOffset
          );
          elements.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          elements.messageB.style.opacity = calcValues(
            values.messageB_opacity_out,
            currentYOffset
          );
          elements.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_out,
            currentYOffset
          )}%, 0)`;
        }
        if (scrollRatio <= 0.62) {
          // in
          elements.messageC.style.opacity = calcValues(
            values.messageC_opacity_in,
            currentYOffset
          );
          elements.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          elements.messageC.style.opacity = calcValues(
            values.messageC_opacity_out,
            currentYOffset
          );
          elements.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.82) {
          // in
          elements.messageD.style.opacity = calcValues(
            values.messageD_opacity_in,
            currentYOffset
          );
          elements.messageD.style.transform = `translate3d(0, ${calcValues(
            values.messageD_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          elements.messageD.style.opacity = calcValues(
            values.messageD_opacity_out,
            currentYOffset
          );
          elements.messageD.style.transform = `translate3d(0, ${calcValues(
            values.messageD_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        break;

      case 1:
        break;

      case 2:
        let sequence2 = Math.round(
          calcValues(values.imageSequence, currentYOffset)
        );
        elements.context.drawImage(elements.videoImages[sequence2], 0, 0);

        if (scrollRatio <= 0.5) {
          elements.canvas.style.opacity = calcValues(
            values.canvas_opacity_in,
            currentYOffset
          );
        } else {
          elements.canvas.style.opacity = calcValues(
            values.canvas_opacity_out,
            currentYOffset
          );
        }

        if (scrollRatio <= 0.32) {
          // in
          elements.messageA.style.opacity = calcValues(
            values.messageA_opacity_in,
            currentYOffset
          );
          elements.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          elements.messageA.style.opacity = calcValues(
            values.messageA_opacity_out,
            currentYOffset
          );
          elements.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.67) {
          // in
          elements.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_in,
            currentYOffset
          )}%, 0)`;
          elements.messageB.style.opacity = calcValues(
            values.messageB_opacity_in,
            currentYOffset
          );
          elements.pinB.style.transform = `scaleY(${calcValues(
            values.pinB_scaleY,
            currentYOffset
          )})`;
        } else {
          // out
          elements.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_out,
            currentYOffset
          )}%, 0)`;
          elements.messageB.style.opacity = calcValues(
            values.messageB_opacity_out,
            currentYOffset
          );
          elements.pinB.style.transform = `scaleY(${calcValues(
            values.pinB_scaleY,
            currentYOffset
          )})`;
        }

        if (scrollRatio <= 0.93) {
          // in
          elements.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_in,
            currentYOffset
          )}%, 0)`;
          elements.messageC.style.opacity = calcValues(
            values.messageC_opacity_in,
            currentYOffset
          );
          elements.pinC.style.transform = `scaleY(${calcValues(
            values.pinC_scaleY,
            currentYOffset
          )})`;
        } else {
          // out
          elements.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_out,
            currentYOffset
          )}%, 0)`;
          elements.messageC.style.opacity = calcValues(
            values.messageC_opacity_out,
            currentYOffset
          );
          elements.pinC.style.transform = `scaleY(${calcValues(
            values.pinC_scaleY,
            currentYOffset
          )})`;
        }

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
  window.addEventListener("load", () => {
    setLayout();
    sceneInfo[0].elements.context.drawImage(
      sceneInfo[0].elements.videoImages[0],
      0,
      0
    );
  });
  window.addEventListener("resize", setLayout);
})();
