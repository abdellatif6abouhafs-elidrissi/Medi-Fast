const TestPage = () => {
  return (
    <div style={{ 
      padding: "50px", 
      fontSize: "24px", 
      textAlign: "center",
      background: "white",
      minHeight: "100vh"
    }}>
      <h1>✅ الصفحة تعمل بنجاح!</h1>
      <p>إذا ظهرت هذه الرسالة، فـ routing يعمل بشكل صحيح</p>
      <p style={{ marginTop: "30px", fontSize: "18px" }}>
        الوقت الحالي: {new Date().toLocaleString('ar')}
      </p>
    </div>
  );
};

export default TestPage;
