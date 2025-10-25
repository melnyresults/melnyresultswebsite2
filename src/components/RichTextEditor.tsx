import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Image from '@tiptap/extension-image';
import { FontSize } from '../lib/tiptap-extensions';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Undo,
  Redo,
  Type,
  Plus,
  Minus,
  ChevronDown,
  Image as ImageIcon
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Start writing your blog post..."
}) => {
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);

  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowHeadingMenu(false);
      setShowFontMenu(false);
    };

    if (showHeadingMenu || showFontMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showHeadingMenu, showFontMenu]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5],
        },
      }),
      Underline,
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-blue underline hover:text-blue-700',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
        'data-placeholder': placeholder,
      },
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      const alt = window.prompt('Enter alt text (for accessibility):') || 'Image';
      editor.chain().focus().setImage({ src: url, alt: alt }).run();
    }
  };

  const increaseFontSize = () => {
    const currentSize = getCurrentFontSize();
    const newSize = currentSize + 2;
    (editor.chain().focus() as any).setFontSize(`${newSize}px`).run();
  };

  const decreaseFontSize = () => {
    const currentSize = getCurrentFontSize();
    const newSize = Math.max(8, currentSize - 2);
    (editor.chain().focus() as any).setFontSize(`${newSize}px`).run();
  };

  const getCurrentFontSize = (): number => {
    const { from, to } = editor.state.selection;
    let fontSize = 16;

    editor.state.doc.nodesBetween(from, to, (node) => {
      if (node.marks) {
        node.marks.forEach((mark) => {
          if (mark.type.name === 'textStyle' && mark.attrs.fontSize) {
            const size = parseInt(mark.attrs.fontSize);
            if (!isNaN(size)) {
              fontSize = size;
            }
          }
        });
      }
    });

    return fontSize;
  };

  const setFontFamily = (font: string) => {
    editor.chain().focus().setFontFamily(font).run();
    setShowFontMenu(false);
  };

  const fonts = [
    { name: 'Default', value: 'Inter, system-ui, sans-serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Times New Roman', value: '"Times New Roman", serif' },
    { name: 'Courier New', value: '"Courier New", monospace' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  ];

  const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }> = ({ onClick, isActive, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-primary-blue text-white' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-3">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Text Formatting */}
          <div className="flex gap-1 mr-4">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Font Family */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowFontMenu(!showFontMenu);
                setShowHeadingMenu(false);
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              title="Font Family"
            >
              <Type className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </button>
            {showFontMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[180px]">
                {fonts.map((font) => (
                  <button
                    key={font.value}
                    type="button"
                    onClick={() => setFontFamily(font.value)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    style={{ fontFamily: font.value }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={decreaseFontSize}
              title="Decrease Font Size"
            >
              <Minus className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={increaseFontSize}
              title="Increase Font Size"
            >
              <Plus className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Headings Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowHeadingMenu(!showHeadingMenu);
                setShowFontMenu(false);
              }}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                editor.isActive('heading')
                  ? 'bg-primary-blue text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
              title="Headings"
            >
              <Heading1 className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </button>
            {showHeadingMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[140px]">
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setParagraph().run();
                    setShowHeadingMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors rounded-t-lg ${
                    editor.isActive('paragraph') ? 'bg-blue-50' : ''
                  }`}
                >
                  Normal
                </button>
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 }).run();
                      setShowHeadingMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                      level === 5 ? 'rounded-b-lg' : ''
                    } ${
                      editor.isActive('heading', { level }) ? 'bg-blue-50' : ''
                    }`}
                    style={{
                      fontSize: level === 1 ? '18px' : level === 2 ? '16px' : level === 3 ? '14px' : level === 4 ? '13px' : '12px',
                      fontWeight: 600
                    }}
                  >
                    Heading {level}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lists */}
          <div className="flex gap-1 mr-4">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Link & Image */}
          <div className="flex gap-1 mr-4">
            <ToolbarButton
              onClick={addLink}
              isActive={editor.isActive('link')}
              title="Add Link"
            >
              <LinkIcon className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={addImage}
              isActive={editor.isActive('image')}
              title="Add Image"
            >
              <ImageIcon className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Undo/Redo */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white">
        <EditorContent 
          editor={editor} 
          className="min-h-[400px]"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;