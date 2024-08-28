"use client";
import React, { useState } from "react";
import Control from "../Control";
import Calendar from "../Calendar";
import styles from "./styles.module.css";
import { SendProofOfPayment } from "../../types/entities/SendProofOfPayment";
import Modal from "../Modal";

const initialProofOfPayment: SendProofOfPayment = {
  nameTotal: "",
  numberDocument: "",
  address: "",
  phoneNumber: "",
  period: "",
  price: "",
  formatPayment: "",
  membershipStart: "",
  membershipTermination: "",
};

export default function FormControl() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<SendProofOfPayment>(
    initialProofOfPayment
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    sendPaymentProof(formData).then((message) => {
      alert(message);
    });
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleDateChange = (id: string) => (date: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: date,
    }));
  };

  return (
    <div className={styles.contentTotalForm}>
      <div>
        <h1 className={styles.titelForm}>Enviar comprobante de pago</h1>
      </div>
      <div className={styles.contentForm}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Control
            id="nameTotal"
            type="text"
            titleLabel="Nombre Completo"
            onChange={handleChange}
            value={formData.nameTotal}
            name="nameTotal"
          />
          <Control
            id="numberDocument"
            type="number"
            titleLabel="Numero de Documento"
            onChange={handleChange}
            value={formData.numberDocument}
            name="numberDocument"
          />
          <Control
            id="address"
            type="text"
            titleLabel="Dirección"
            onChange={handleChange}
            value={formData.address}
            name="address"
          />
          <Control
            id="phoneNumber"
            type="text"
            titleLabel="Telefono"
            onChange={handleChange}
            value={formData.phoneNumber}
            name="phoneNumber"
          />
          <Control
            id="period"
            type="text"
            titleLabel="Periodo"
            onChange={handleChange}
            value={formData.period}
            name="period"
          />
          <Control
            id="price"
            type="number"
            titleLabel="Precio"
            onChange={handleChange}
            value={formData.price}
            name="price"
          />
          <Control
            id="formatPayment"
            type="text"
            titleLabel="Forma de pago"
            onChange={handleChange}
            value={formData.formatPayment}
            name="formatPayment"
          />
          <Calendar
            id="membershipStart"
            labelName="Inicio de membresia"
            onChange={handleDateChange("membershipStart")}
            value={formData.membershipStart}
          />
          <Calendar
            id="membershipTermination"
            labelName="Termino de membresia"
            onChange={handleDateChange("membershipTermination")}
            value={formData.membershipTermination}
          />
          <div className={styles.contentButtonAdd}>
            <button className={styles.buttonAdd} type="submit">
              Enviar
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <Modal handleCancel={handleCancel} handleConfirm={handleConfirm} />
      )}
    </div>
  );
}

async function sendPaymentProof(data: SendProofOfPayment) {
  try {
    const response = await fetch(
      "https://lasting-master-walleye.ngrok-free.app/whatsappAttachedFile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }

    const result = await response.json();
    console.log("Comprobante enviado:", result);
    return "Comprobante enviado con éxito";
  } catch (error) {
    console.error("Error al enviar comprobante:", error);
    return "Error al enviar comprobante";
  }
}
