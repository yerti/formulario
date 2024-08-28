import React from "react";
import styles from './styles.module.css'

interface ModalProps {
    handleConfirm: () => void;
    handleCancel: () => void;
}

export default function Modal({handleConfirm, handleCancel}: ModalProps) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.titleModal}>¿Estás seguro de enviar el comprobante de pago?</h2>
        <div className={styles.modalActions}>
          <button className={styles.buttonYes} onClick={handleConfirm}>Sí</button>
          <button className={styles.buttonNot} onClick={handleCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
