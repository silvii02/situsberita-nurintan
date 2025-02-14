import React from 'react';

const ReloadButton = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div style={{marginTop: "20px"}}>
      <button onClick={handleReload} style={styles.button}>
      Klik disini jika Full-Text artikel belum terbuka
      </button>
    </div>
  );
};

const styles = {
  button: {
    padding: '10px 20px',
    fontSize: '12px',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  }
};

export default ReloadButton;
