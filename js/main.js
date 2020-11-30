(() => {
  let yOffset = 0; // window.pageYoffset
  let totalPrevScrollHeight = 0; // 이전 섹션의 높이 총 합
  let currentScene = 0; // 현재 섹션
  let enterNewScene = false; // 새로운 섹션 진입 시에만 true 변경
  let acc = 0.1;
  let delayedYOffset = 0;
  let rafId;
  let rafState;

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
        canvas: document.querySelector(".image-blend-canvas"),
        context: document.querySelector(".image-blend-canvas").getContext("2d"),
        imagesPath: [
          "./images/blend-image-1.jpg",
          "./images/blend-image-2.jpg",
        ],
        images: [],
      },
      // start x, end x
      values: {
        rect1X: [0, 0, { start: 0, end: 0 }],
        rect2X: [0, 0, { start: 0, end: 0 }],
        blendHeight: [0, 0, { start: 0, end: 0 }],
        canvas_scale: [0, 0, { start: 0, end: 0 }],
        canvasCaption_opacity: [0, 1, { start: 0, end: 0 }],
        canvasCaption_translateY: [20, 0, { start: 0, end: 0 }],
        rectStartY: 0,
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

    let image3;
    for (let i = 0; i < sceneInfo[3].elements.imagesPath.length; i++) {
      image3 = new Image();
      image3.src = sceneInfo[3].elements.imagesPath[i];
      sceneInfo[3].elements.images.push(image3);
    }
  };

  const checkMenu = () => {
    if (yOffset > 44) {
      document.body.classList.add("local-nav-sticky");
    } else {
      document.body.classList.remove("local-nav-sticky");
    }
  };

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
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
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
        // 현재 YOffset 값보다 부분 스크롤 시작 값이 낮을 경우, 시작 값으로 설정
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        // 현재 YOffset 값이 부분 스크롤 끝 값보다 클 경우, end 값으로 설정
        rv = values[1];
      }
    } else {
      // scrollRatio가 0.25일 경우 0.25 * ( end(1) - start(0) ) + start(0) = 0.25
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
        // let sequence = Math.round(
        //   calcValues(values.imageSequence, currentYOffset)
        // );
        // elements.context.drawImage(elements.videoImages[sequence], 0, 0);
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
        // let sequence2 = Math.round(
        //   calcValues(values.imageSequence, currentYOffset)
        // );
        // elements.context.drawImage(elements.videoImages[sequence2], 0, 0);

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

        if (scrollRatio > 0.9) {
          const elements = sceneInfo[3].elements;
          const values = sceneInfo[3].values;
          const widthRatio = window.innerWidth / elements.canvas.width;
          const heightRatio = window.innerHeight / elements.canvas.height;
          let canvasScaleRatio;

          if (widthRatio <= heightRatio) {
            // 캔버스보다 브라우저 창이 홀쭉(세로형)한 경우
            canvasScaleRatio = heightRatio;
          } else {
            // 캔버스보다 브라우저 창이 (가로형)납작한 경우
            canvasScaleRatio = widthRatio;
          }

          // currentScene3에서 쓰는 캔버스를 미리 그려줌

          elements.canvas.style.transform = `scale(${canvasScaleRatio})`;
          elements.context.fillStyle = "white";
          elements.context.drawImage(elements.images[0], 0, 0);

          const recalculatedInnerWidth =
            document.body.offsetWidth / canvasScaleRatio;
          const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

          const whiteRectWidth = recalculatedInnerWidth * 0.15;
          values.rect1X[0] =
            (elements.canvas.width - recalculatedInnerWidth) / 2;
          values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
          values.rect2X[0] =
            values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
          values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

          elements.context.fillRect(
            parseInt(values.rect1X[0]),
            0,
            parseInt(whiteRectWidth),
            elements.canvas.height
          );
          elements.context.fillRect(
            parseInt(values.rect2X[0]),
            0,
            parseInt(whiteRectWidth),
            elements.canvas.height
          );
        }

        break;

      case 3:
        // Canvas의 크기는 1920 * 1080으로 고정되어 있는 상태에서
        // 브라우저의 크기 중 (w,h를 실제 크기 1920 * 1080을 백분율로 구해서)
        // 더 큰 값을 scale에 대입한다.
        let step = 0;
        const widthRatio = window.innerWidth / elements.canvas.width;
        const heightRatio = window.innerHeight / elements.canvas.height;
        let canvasScaleRatio;
        if (widthRatio <= heightRatio) {
          // 캔버스보다 브라우저 창이 홀쭉(세로형)한 경우
          canvasScaleRatio = heightRatio;
        } else {
          // 캔버스보다 브라우저 창이 (가로형)납작한 경우
          canvasScaleRatio = widthRatio;
        }

        elements.canvas.style.transform = `scale(${canvasScaleRatio})`;
        elements.context.fillStyle = "white";
        elements.context.drawImage(elements.images[0], 0, 0);

        // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
        // height가 높을 경우 height는 1080, width는 가변적(실제 크기보다 더 높아짐)
        // width가 높을 경우 width가 1920, height 가변적(실제 크기보다 더 높아짐)
        // innerWidth는 스크롤 포함이기 때문에 body의 offsetWidth를 쓴다.
        const recalculatedInnerWidth =
          document.body.offsetWidth / canvasScaleRatio;
        const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

        // 스크롤이 시작된 값이 rectStartY, 종료된 값은 시작된 값 / 해당 섹션의 총 스크롤 길이
        if (!values.rectStartY) {
          // * 애니메이션이 시작해야 하는 top 값을 구해야 하는 로직

          // values.rectStartY = elements.canvas.getBoundingClientRect().top;
          // offsetTop또한 scale 변형된 값 이전의 원시적인 값을 바라본다.
          // 구해야 하는 값은 scale로 줄어든 캔버스의 offsetTop 값으로,
          // 원시 캔버스의 height 값 - scale로 줄어든 캔버스의 height를 하면,
          // 추가된 height 값이 나온다. 여기선 canvas가 flex에 의해 가운데 정렬되었고,
          // 필요한 건 박스 상단의 여백 top 값이기 때문에 해당 값에 나누기 2를 해주면 된다.
          // innerHeight / originCanvasHeight = 백분율을 수치로 되돌리기 위해
          // originCanvasHeight * 백분율을 해준다.
          values.rectStartY =
            elements.canvas.offsetTop +
            (elements.canvas.height -
              elements.canvas.height * canvasScaleRatio) /
              2;
          values.rect1X[2].start = window.innerHeight / 2 / currentSceneScroll;
          values.rect2X[2].start = window.innerHeight / 2 / currentSceneScroll;
          values.rect1X[2].end = values.rectStartY / currentSceneScroll;
          values.rect2X[2].end = values.rectStartY / currentSceneScroll;
        }

        // 재 계산된 width 값의 15%, 좌 우측 여백의 각 값..
        const whiteRectWidth = recalculatedInnerWidth * 0.15;

        // * 조심해야 할 것, scale은 실제 width height 값을 조정하는 게 아니라,
        // 보이는 것을 조정하기 때문에 아래 계산할 때 요소 검사를 통해 실제 width, height 값으로
        // 계산할 경우 엄청난 착오가 생길 수 있음.

        // 1920의 캔버스 고정 width 값에서, 재 계산된 width 값을 뺸 후 2로 나눔.
        // 총 canva 크기 - 실제 화면 크기 === 좌우측 여백의 값 만큼 남게 됨.
        // 그러므로, 좌우측 여백의 각 위드값 및 좌측의 시작 지점이 됨.
        // 첫 번째 x 좌표의 시작 지점을 구하는 것.
        values.rect1X[0] = (elements.canvas.width - recalculatedInnerWidth) / 2;

        // 스크롤이 내려갔을 때 이동할 x 값, 위의 구해준 값 (시작 지점)에서 여백의 크기만큼
        // 뺴주면 0으로 돌아간다. 사실상 0이나 마찬가지?

        values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
        // 우측의 x값. 좌측 여백의 크기 + 실제 화면의 크기 (재 계산된 값) - 좌우측 여백의 크기
        // 위의 계산 === 우측 여백의 x 지점.
        values.rect2X[0] =
          values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;

        values.rect2X[1] = values.rect2X[0] + whiteRectWidth;
        // elements.context.fillRect(
        //   values.rect1X[0],
        //   0,
        //   parseInt(whiteRectWidth),
        //   elements.canvas.height
        // );
        // elements.context.fillRect(
        //   values.rect2X[0],
        //   0,
        //   parseInt(whiteRectWidth),
        //   elements.canvas.height
        // );
        elements.context.fillRect(
          parseInt(calcValues(values.rect1X, currentYOffset)),
          0,
          parseInt(whiteRectWidth),
          elements.canvas.height
        );
        elements.context.fillRect(
          parseInt(calcValues(values.rect2X, currentYOffset)),
          0,
          parseInt(whiteRectWidth),
          elements.canvas.height
        );

        if (scrollRatio < values.rect1X[2].end) {
          step = 1;
          elements.canvas.classList.remove("sticky");
        } else {
          step = 2;
          values.blendHeight[0] = 0;
          values.blendHeight[1] = elements.canvas.height;
          values.blendHeight[2].start = values.rect1X[2].end;
          values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
          const blendHeight = calcValues(values.blendHeight, currentYOffset);

          // elements.canvas-height (1080) - blendHeight (0부터 end까지 올라감) 을 빼면
          // 1080에서 end 시점은 0이 되므로 아래에서 위로 그려지는 것
          // dX,   the left X canvas position to start drawing the clipped sub-image
          //   dY,  the top Y canvas position to start drawing the clipped sub-image
          //   dW,  scale sW to dW and draw a dW wide sub-image on the canvas
          //   dH;  scale sH to dH and draw a dH high sub-image on the canvas

          // elements.context.drawImage(
          //   elements.images[1],
          //   0,
          //   elements.canvas.height - blendHeight,
          //   elements.canvas.width,
          //   blendHeight,
          //   0,
          //   elements.canvas.height - blendHeight,
          //   elements.canvas.width,
          //   blendHeight
          // );

          elements.context.drawImage(
            elements.images[1],
            0,
            elements.canvas.height - blendHeight,
            elements.canvas.width,
            blendHeight,
            0,
            elements.canvas.height - blendHeight,
            elements.canvas.width,
            blendHeight
          );

          elements.canvas.classList.add("sticky");
          elements.canvas.style.top = `${
            -(
              elements.canvas.height -
              elements.canvas.height * canvasScaleRatio
            ) / 2
          }px`;

          // 현재 스크롤이 draw animatino을 끝냈을 때부터 시작, 스케일이 점점 낮아지는 구간
          if (scrollRatio > values.blendHeight[2].end) {
            values.canvas_scale[0] = canvasScaleRatio;
            values.canvas_scale[1] =
              document.body.offsetWidth / (1.5 * elements.canvas.width);

            values.canvas_scale[2].start = values.blendHeight[2].end;
            values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;

            elements.canvas.style.transform = `scale(${calcValues(
              values.canvas_scale,
              currentYOffset
            )})`;
            elements.canvas.style.marginTop = 0;
          }

          // 스케일이 모두 낮아지고, 다시 포지션이 정상으로 돌아간 후 픽스된 순간부터
          // 내려온 top 값을 margin-top 으로 잡아줌.
          if (
            scrollRatio > values.canvas_scale[2].end &&
            values.canvas_scale[2].end > 0
          ) {
            elements.canvas.classList.remove("sticky");
            // fixed가 되고나서 0.4배만큼 내려왔기 때문에 0.4 margin top 값 대입.
            elements.canvas.style.marginTop = `${currentSceneScroll * 0.4}px`;

            values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
            values.canvasCaption_opacity[2].end =
              values.canvasCaption_opacity[2].start + 0.1;

            values.canvasCaption_translateY[2].start =
              values.canvasCaption_opacity[2].start;
            values.canvasCaption_translateY[2].end =
              values.canvasCaption_opacity[2].end;

            elements.canvasCaption.style.opacity = calcValues(
              values.canvasCaption_opacity,
              currentYOffset
            );
            elements.canvasCaption.style.transform = `translate3d(0,${calcValues(
              values.canvasCaption_translateY,
              currentYOffset
            )}%, 0)`;
          }
        }

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

    if (delayedYOffset < totalPrevScrollHeight + scrollHeight) {
      document.body.classList.remove("scroll-effect-end");
    }

    if (delayedYOffset > totalPrevScrollHeight + scrollHeight) {
      enterNewScene = true;

      if (currentScene === sceneInfo.length - 1) {
        document.body.classList.add("scroll-effect-end");
      }
      if (currentScene < sceneInfo.length - 1) {
        currentScene++;
      }
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (delayedYOffset < totalPrevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return null;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (enterNewScene) return null;

    playAnimation();
  };

  function loop() {
    // 감속의 원리
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

    if (!enterNewScene) {
      if (currentScene === 0 || currentScene === 2) {
        const currentYOffset = delayedYOffset - totalPrevScrollHeight;
        const elements = sceneInfo[currentScene].elements;
        const values = sceneInfo[currentScene].values;
        let sequence = Math.round(
          calcValues(values.imageSequence, currentYOffset)
        );
        if (elements.videoImages[sequence]) {
          elements.context.drawImage(elements.videoImages[sequence], 0, 0);
        }
      }
    }

    rafId = requestAnimationFrame(loop);

    if (Math.abs(pageYOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  }

  window.addEventListener("load", () => {
    document.body.classList.remove("before-load");
    setLayout();
    sceneInfo[0].elements.context.drawImage(
      sceneInfo[0].elements.videoImages[0],
      0,
      0
    );

    let tempYOffset = yOffset;
    let tempScrollCount = 0;

    if (yOffset > 0) {
      let siId = setInterval(() => {
        window.scrollTo(0, tempYOffset);
        tempYOffset += 2;
        if (tempScrollCount >= 20) {
          clearInterval(siId);
        }
        tempScrollCount++;
      }, 20);
    }

    window.addEventListener("scroll", () => {
      yOffset = window.pageYOffset;
      scrollLoop();
      checkMenu();

      if (!rafState) {
        rafId = requestAnimationFrame(loop);
        refState = true;
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        // setLayout();
        // sceneInfo[3].values.rectStartY = 0;
        window.location.reload();
      }
    });
    window.addEventListener("orientationchange", () => {
      scrollTo(0, 0);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
    document
      .querySelector(".loading")
      .addEventListener("transitionend", (e) => {
        document.body.removeChild(e.currentTarget);
      });
  });

  setCanvasImages();
})();
