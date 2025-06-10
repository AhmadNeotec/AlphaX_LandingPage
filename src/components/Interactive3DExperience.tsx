import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

// Define our own interface for Widget props
interface ChatWidgetProps {
  handleNewUserMessage: (message: string) => void;
  title: string;
  subtitle: string;
  senderPlaceHolder: string;
  profileAvatar: string;
  launcher: (handleToggle: () => void) => React.ReactNode;
}

// 3D Scene Component
const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#774A67" />
        </mesh>
      </Float>
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        AlphaX ERP
      </Text>
      <OrbitControls enableZoom={true} />
    </>
  );
};

// Main Component
const Interactive3DExperience = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleNewUserMessage = (newMessage: string) => {
    // Here you would typically process the message and get a response
    // For now, we'll just echo back
    setTimeout(() => {
      addResponseMessage(`I received your message: ${newMessage}`);
    }, 1000);
  };

  const widgetProps: ChatWidgetProps = {
    handleNewUserMessage,
    title: "AlphaX Assistant",
    subtitle: "Ask me anything about your ERP system",
    senderPlaceHolder: "Type your message...",
    profileAvatar: "src/images/alpha-Photoroom.png",
    launcher: (handleToggle: () => void) => (
      <button
        onClick={handleToggle}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#774A67',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }}
      >
        <img
          src="src/images/alpha-Photoroom.png"
          alt="chat"
          style={{ width: '30px', height: '30px' }}
        />
      </button>
    ),
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Scene />
      </Canvas>
      
      {/* @ts-ignore */}
      <Widget {...widgetProps} />
    </div>
  );
};

export default Interactive3DExperience; 