const TestComponent = () => {
  console.log("TestComponent is rendering!");
  alert("TestComponent loaded!");
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>TEST COMPONENT WORKING!</h1>
      <p>If you can see this, the routing is working.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
      <button onClick={() => alert("Button clicked!")}>Test Button</button>
    </div>
  );
};

export default TestComponent;
