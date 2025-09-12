
import {
  CloudUploadOutlined,
  CopyOutlined,
  DeleteOutlined,
  DislikeOutlined,
  EditOutlined,
  LikeOutlined,
  PaperClipOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from '@ant-design/x';
import { Avatar, Button, Flex, Space, Spin, message } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { __awaiter, processStreamChunkData } from './utils';
import { DEFAULT_CONVERSATIONS_ITEMS, SENDER_PROMPTS } from './const';
import { useStyle } from './style';

const Independent = () => {
  const { styles } = useStyle();
  const abortController = useRef(null);
  // ==================== State ====================
  const [messageHistory, setMessageHistory] = useState({});
  const [conversations, setConversations] = useState(DEFAULT_CONVERSATIONS_ITEMS);
  const [curConversation, setCurConversation] = useState(DEFAULT_CONVERSATIONS_ITEMS[0].key);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [inputValue, setInputValue] = useState('');
  /**
   * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
   */
  // ==================== Runtime ====================
  const [agent] = useXAgent({
    baseURL: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B',
    dangerouslyApiKey: 'Bearer xxx',
  });
  const loading = agent.isRequesting();
  const { onRequest, messages, setMessages } = useXChat({
    agent,
    requestFallback: (_, { error }) => {
      if (error.name === 'AbortError') {
        return {
          content: 'Request is aborted',
          role: 'assistant',
        };
      }
      return {
        content: 'Request failed, please try again!',
        role: 'assistant',
      };
    },
    transformMessage: info => {
      return processStreamChunkData(info);
    },
    resolveAbortController: controller => {
      abortController.current = controller;
    },
  });
  // ==================== Event ====================
  const onSubmit = val => {
    if (!val) return;
    if (loading) {
      message.error('Request is in progress, please wait for the request to complete.');
      return;
    }
    onRequest({
      stream: true,
      message: { role: 'user', content: val },
    });
  };

  // ==================== Left Panel ====================
  const chatSider = (
    <div className={styles.sider}>
      {/* 🌟 Logo */}
      <div className={styles.logo}>
        <img
          src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
          draggable={false}
          alt="logo"
          width={24}
          height={24}
        />
        <span>Monto Chat</span>
      </div>

      {/* 🌟 添加会话 */}
      <Button
        onClick={() => {
          const now = dayjs().valueOf().toString();
          setConversations([
            {
              key: now,
              label: `新会话 ${conversations.length + 1}`,
              group: 'Today',
            },
            ...conversations,
          ]);
          setCurConversation(now);
          setMessages([]);
        }}
        type="link"
        className={styles.addBtn}
        icon={<PlusOutlined />}
      >
        新会话
      </Button>

      {/* 🌟 会话管理 */}
      <Conversations
        items={conversations}
        className={styles.conversations}
        activeKey={curConversation}
        onActiveChange={val =>
          // eslint-disable-next-line require-yield
          __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            (_a = abortController.current) === null || _a === void 0 ? void 0 : _a.abort();
            // The abort execution will trigger an asynchronous requestFallback, which may lead to timing issues.
            // In future versions, the sessionId capability will be added to resolve this problem.
            setTimeout(() => {
              setCurConversation(val);
              setMessages(
                (messageHistory === null || messageHistory === void 0
                  ? void 0
                  : messageHistory[val]) || [],
              );
            }, 100);
          })
        }
        groupable
        styles={{ item: { padding: '0 8px' } }}
        menu={conversation => ({
          items: [
            {
              label: 'Rename',
              key: 'rename',
              icon: <EditOutlined />,
              onClick: () => {
                // coming soon
                message.info('Coming soon');
              },
            },
            {
              label: 'Delete',
              key: 'delete',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => {
                var _a;
                const newList = conversations.filter(item => item.key !== conversation.key);
                const newKey =
                  (_a = newList === null || newList === void 0 ? void 0 : newList[0]) === null ||
                    _a === void 0
                    ? void 0
                    : _a.key;
                setConversations(newList);
                // The delete operation modifies curConversation and triggers onActiveChange, so it needs to be executed with a delay to ensure it overrides correctly at the end.
                // This feature will be fixed in a future version.
                setTimeout(() => {
                  if (conversation.key === curConversation) {
                    setCurConversation(newKey);
                    setMessages(
                      (messageHistory === null || messageHistory === void 0
                        ? void 0
                        : messageHistory[newKey]) || [],
                    );
                  }
                }, 200);
              },
            },
          ],
        })}
      />

      <div className={styles.siderFooter}>
        <Avatar size={24} icon={<UserOutlined />} />
        <Button type="text" icon={<QuestionCircleOutlined />} />
      </div>
    </div>
  );

  // ==================== Right Panel ====================
  const chatList = (
    <div className={styles.chatList}>
      {(messages === null || messages === void 0 ? void 0 : messages.length) ? (
        /* 🌟 消息列表 */
        <Bubble.List
          items={
            messages === null || messages === void 0
              ? void 0
              : messages.map(i =>
                Object.assign(Object.assign({}, i.message), {
                  classNames: {
                    content: i.status === 'loading' ? styles.loadingMessage : '',
                  },
                  typing:
                    i.status === 'loading' ? { step: 5, interval: 20, suffix: <>💗</> } : false,
                }),
              )
          }
          style={{ height: '100%', paddingInline: 'calc(calc(100% - 700px) /2)' }}
          roles={{
            assistant: {
              placement: 'start',
              footer: (
                <div style={{ display: 'flex' }}>
                  <Button type="text" size="small" icon={<ReloadOutlined />} />
                  <Button type="text" size="small" icon={<CopyOutlined />} />
                  <Button type="text" size="small" icon={<LikeOutlined />} />
                  <Button type="text" size="small" icon={<DislikeOutlined />} />
                </div>
              ),
              loadingRender: () => <Spin size="small" />,
            },
            user: { placement: 'end' },
          }}
        />
      ) : (
        <Space
          direction="vertical"
          size={16}
          // 用 padding 来居中
          style={{ paddingInline: 'calc(calc(100% - 700px) /2)', height: '100%', justifyContent: 'center', paddingTop: 0 }}
          className={styles.placeholder}
        >
          <Welcome
            variant="borderless"
            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            title="你好, I'm Monto Chat"
            description="基于Ant Design 和 硅基流动模型的 AI 聊天机器人~"
            extra={
              <Space>
              </Space>
            }
          />
        </Space>
      )}
    </div>
  );

  const senderHeader = (
    <Sender.Header
      title="Upload File"
      open={attachmentsOpen}
      onOpenChange={setAttachmentsOpen}
      styles={{ content: { padding: 0 } }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={info => setAttachedFiles(info.fileList)}
        placeholder={type =>
          type === 'drop'
            ? { title: 'Drop file here' }
            : {
              icon: <CloudUploadOutlined />,
              title: 'Upload files',
              description: 'Click or drag files to this area to upload',
            }
        }
      />
    </Sender.Header>
  );
  const chatSender = (
    <>
      {/* 🌟 预置提示词 */}
      <Prompts
        items={SENDER_PROMPTS}
        onItemClick={info => {
          onSubmit(info.data.description);
        }}
        styles={{
          item: { padding: '6px 12px' },
        }}
        className={styles.senderPrompt}
      />
      {/* 🌟 输入框 */}
      <Sender
        value={inputValue}
        header={senderHeader}
        onSubmit={() => {
          onSubmit(inputValue);
          setInputValue('');
        }}
        onChange={setInputValue}
        onCancel={() => {
          var _a;
          (_a = abortController.current) === null || _a === void 0 ? void 0 : _a.abort();
        }}
        prefix={
          <Button
            type="text"
            icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
            onClick={() => setAttachmentsOpen(!attachmentsOpen)}
          />
        }
        loading={loading}
        className={styles.sender}
        allowSpeech
        actions={(_, info) => {
          const { SendButton, LoadingButton, SpeechButton } = info.components;
          return (
            <Flex gap={4}>
              {/* 不写，默认就是这个 */}
              <SpeechButton className={styles.speechButton} />
              {loading ? <LoadingButton type="default" /> : <SendButton type="primary" />}
            </Flex>
          );
        }}
        placeholder="Ask or input / use skills"
      />
    </>
  );
  useEffect(() => {
    // history mock
    if (messages === null || messages === void 0 ? void 0 : messages.length) {
      setMessageHistory(prev =>
        Object.assign(Object.assign({}, prev), { [curConversation]: messages }),
      );
    }
  }, [messages, curConversation]);

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      {chatSider}

      <div className={styles.chat}>
        {chatList}
        {chatSender}
      </div>
    </div>
  );
};

export default Independent;