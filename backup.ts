// figma.showUI(__html__);

// async function buildPixels(paint, width, height, xPos, yPos, name) {
//   if (paint.type === 'IMAGE') {
//     const image = figma.getImageByHash(paint.imageHash)
//     const bytes = await image.getBytesAsync()
  
//     figma.showUI(__html__, { visible: false })
//     figma.ui.postMessage({ bytes, width, height })

//     const imageData: any = await new Promise((resolve, reject) => {
//       figma.ui.onmessage = value => resolve(value)
//     })

//     const perChunk = 4;
//     const inputArray = Object.entries(imageData.data)
//     const pixels = inputArray.reduce((resultArray, item, index) => { 
//       const chunkIndex = Math.floor(index/perChunk)

//       if(!resultArray[chunkIndex]) {
//         resultArray[chunkIndex] = []
//       }

//       resultArray[chunkIndex].push(item)

//       return resultArray
//     }, [])

//     // Setup the nodes
//     const nodes: SceneNode[] = [];

//     // Create a new Frame
//     const newFrame = figma.createFrame();

//     // Resize it to fit target dims
//     newFrame.x = xPos + width;
//     newFrame.y = yPos;
//     newFrame.name = name;
//     newFrame.resize(width, height);
//     figma.currentPage.appendChild(newFrame);
//     nodes.push(newFrame);

//     let xStep = 0;
//     let x = 1;
//     let y = 1;

//     for (let i = 0; i < pixels.length; i++) {

//       if (i / (width * y) === 1) {
//         y = y + 1;
//         xStep = xStep + 1;
//       }

//       x = i - (width * xStep)

//       const rect = figma.createRectangle();
//       rect.resize(1,1);
//       rect.x = x;
//       rect.y = y - 1;
//       rect.fills = [{
//         type: 'SOLID',
//         color: {
//           r: pixels[i][0][1] / 255,
//           g: pixels[i][1][1] / 255,
//           b: pixels[i][2][1] / 255
//         },
//         opacity: pixels[i][3][1] / 255
//       }];
//       newFrame.appendChild(rect)
//     }

//     figma.currentPage.selection = nodes;
//     //figma.viewport.scrollAndZoomIntoView(nodes);
//   }

//   return paint
// }

// async function findImage(node) {
//   console.log(node)
//   switch (node.type) {
//     case 'RECTANGLE':
//     case 'ELLIPSE':
//     case 'VECTOR':
//     case 'TEXT': {
//       const newFills = []
//       for (const paint of node.fills) {
//         newFills.push(await buildPixels(paint, node.width, node.height, node.x, node.y, node.name))
//       }
//       node.fills = newFills
//       break
//     }

//     default: {
//     }
//   }
// }

// figma.ui.onmessage = (msg) => {
//   if (msg.type === "chunkify") {
//     Promise.all(figma.currentPage.selection.map(selected => findImage(selected))).then(() => figma.closePlugin())
//   }
// };
