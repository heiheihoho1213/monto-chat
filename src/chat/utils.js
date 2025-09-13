// 将 Generator 函数转换为 Promise
export const __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
          resolve(value);
        });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };

// export const processStreamChunkData = (data) => {
//   var _a, _b, _c, _d, _e, _f, _g;
//   const { originMessage, chunk } = data || {};
//   let currentContent = '';
//   let currentThink = '';
//   try {
//     if (
//       (chunk === null || chunk === void 0 ? void 0 : chunk.data) &&
//       !(chunk === null || chunk === void 0 ? void 0 : chunk.data.includes('DONE'))
//     ) {
//       const message = JSON.parse(chunk === null || chunk === void 0 ? void 0 : chunk.data);
//       currentThink =
//         ((_c =
//           (_b =
//             (_a = message === null || message === void 0 ? void 0 : message.choices) === null ||
//               _a === void 0
//               ? void 0
//               : _a[0]) === null || _b === void 0
//             ? void 0
//             : _b.delta) === null || _c === void 0
//           ? void 0
//           : _c.reasoning_content) || '';
//       currentContent =
//         ((_f =
//           (_e =
//             (_d = message === null || message === void 0 ? void 0 : message.choices) === null ||
//               _d === void 0
//               ? void 0
//               : _d[0]) === null || _e === void 0
//             ? void 0
//             : _e.delta) === null || _f === void 0
//           ? void 0
//           : _f.content) || '';
//     }
//   } catch (error) {
//     console.error(error);
//   }
//   let content = '';
//   if (
//     !(originMessage === null || originMessage === void 0 ? void 0 : originMessage.content) &&
//     currentThink
//   ) {
//     content = `<think>${currentThink}`;
//   } else if (
//     ((_g =
//       originMessage === null || originMessage === void 0 ? void 0 : originMessage.content) ===
//       null || _g === void 0
//       ? void 0
//       : _g.includes('<think>')) &&
//     !(originMessage === null || originMessage === void 0
//       ? void 0
//       : originMessage.content.includes('</think>')) &&
//     currentContent
//   ) {
//     content = `${originMessage === null || originMessage === void 0 ? void 0 : originMessage.content}</think>${currentContent}`;
//   } else {
//     content = `${(originMessage === null || originMessage === void 0 ? void 0 : originMessage.content) || ''}${currentThink}${currentContent}`;
//   }
//   return {
//     content: content,
//     role: 'assistant',
//   };
// }

export const processStreamChunkData = (data) => {
  var _a, _b, _c, _d, _e, _f;
  const { originMessage, chunk } = data || {};
  let currentContent = '';
  let currentThink = '';
  
  try {
    if (
      (chunk === null || chunk === void 0 ? void 0 : chunk.data) &&
      !(chunk === null || chunk === void 0 ? void 0 : chunk.data.includes('DONE'))
    ) {
      const message = JSON.parse(chunk === null || chunk === void 0 ? void 0 : chunk.data);
      currentThink =
        ((_c =
          (_b =
            (_a = message === null || message === void 0 ? void 0 : message.choices) === null ||
              _a === void 0
              ? void 0
              : _a[0]) === null || _b === void 0
            ? void 0
            : _b.delta) === null || _c === void 0
          ? void 0
          : _c.reasoning_content) || '';
      currentContent =
        ((_f =
          (_e =
            (_d = message === null || message === void 0 ? void 0 : message.choices) === null ||
              _d === void 0
              ? void 0
              : _d[0]) === null || _e === void 0
            ? void 0
            : _e.delta) === null || _f === void 0
          ? void 0
          : _f.content) || '';
    }
  } catch (error) {
    console.error(error);
  }
  
  // 获取之前累积的内容和思考内容
  const prevContent = originMessage?.content || '';
  const prevThink = originMessage?.think || '';
  
  // 累积思考内容
  const accumulatedThink = prevThink + currentThink;
  
  // 累积普通内容（不包含思考内容）
  const accumulatedContent = prevContent + currentContent;
  
  return {
    content: accumulatedContent,  // 只返回普通内容，不包含思考标签
    think: accumulatedThink,      // 单独返回思考内容
    role: 'assistant',
  };
}