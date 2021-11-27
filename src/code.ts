figma.showUI(__html__);

const fetchData = async (paint, width, height, xPos, yPos, name, index) => {
  if (paint.type !== 'IMAGE') return

  let image = figma.getImageByHash(paint.imageHash)
  let bytes = await image.getBytesAsync()

  console.log(index, image, bytes);

  // Create an invisible iframe to act as a "worker" which
  // will do the task of decoding and send us a message
  // when it's done.
  //figma.showUI(__html__, { visible: true })

  // Send the raw bytes of the file to the worker.
  figma.ui.postMessage({ bytes, width, height })

  // Wait for the worker's response.
  const imageData = await new Promise((resolve, reject) => {
    figma.ui.onmessage = value => resolve(value)
  })

  if (imageData) {
    // figma.ui.close();
    return await build(imageData, name, xPos, yPos, width, height);
  }
}

const build = async (imageData, name, xPos, yPos, width, height) => {
  let perChunk = 4;
  let inputArray = Object.entries(imageData.data);
  let pixels = inputArray.reduce((resultArray, item, index) => { 
    let chunkIndex = Math.floor(index/perChunk)
    if(!resultArray[chunkIndex]) resultArray[chunkIndex] = []
    resultArray[chunkIndex].push(item) 
    return resultArray
  }, [])

  // Setup the nodes
  let nodes: SceneNode[] = [];

  // Create a new Frame
  let newFrame = figma.createFrame();

  // Resize it to fit target dims
  newFrame.x = xPos + width;
  newFrame.y = yPos;
  newFrame.name = name;
  newFrame.resize(width, height);
  figma.currentPage.appendChild(newFrame);
  nodes.push(newFrame);

  let xStep = 0;
  let x = 1;
  let y = 1;

  for (let i = 0; i < pixels.length; i++) {

    if (i / (width * y) === 1) {
      y = y + 1;
      xStep = xStep + 1;
    }

    x = i - (width * xStep)

    let rect = figma.createRectangle();
    rect.resize(1,1);
    rect.x = x;
    rect.y = y - 1;
    rect.fills = [{
      type: 'SOLID',
      color: {
        r: pixels[i][0][1] / 255,
        g: pixels[i][1][1] / 255,
        b: pixels[i][2][1] / 255
      },
      opacity: pixels[i][3][1] / 255
    }];
    newFrame.appendChild(rect)
  }

  figma.currentPage.selection = nodes;
  //figma.viewport.scrollAndZoomIntoView(nodes);

  return;
}

const findImage = async (node, i) => {
  for (const paint of node.fills) {
    return await fetchData(paint, node.width, node.height, node.x, node.y, node.name, i)
  }
}

figma.ui.onmessage = (msg) => {
  if (msg.type === "chunkify") {
    console.clear()
    Promise.all(figma.currentPage.selection.map((selected, i) => {
      return findImage(selected, i)
    })).then(() => {
      figma.closePlugin()
      figma.showUI(__html__);
    })
  }
};
