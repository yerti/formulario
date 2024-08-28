"use client";
import React, { useState } from "react";
import Control from "../Control";
import Calendar from "../Calendar";
import styles from "./styles.module.css";
import { SendProofOfPayment } from "../../types/entities/SendProofOfPayment";
import Modal from "../Modal";

const initialProofOfPayment: SendProofOfPayment = {
  nombreYApellidos: "",
  numeroDocumento: "",
  direccion: "",
  telefonoSocio: "",
  periodo: "",
  precio: 0,
  abono: 0,
  formaDePago: "",
  inicioDeMembresia: "",
  terminoDeMembresia: "",
};

export default function FormControl() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<SendProofOfPayment>(
    initialProofOfPayment
  );
  const [hideAbono, setHideAbono] = useState(true);

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

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHideAbono(!hideAbono);
  };
  const handleDateChange = (id: string) => (date: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: date,
    }));
  };

  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  async function sendPaymentProof(data: SendProofOfPayment) {
    try {
      const formattedData = {
        ...data,
        inicioDeMembresia: formatDate(data.inicioDeMembresia),
        terminoDeMembresia: formatDate(data.terminoDeMembresia),
        telefonoSocio: String(data.telefonoSocio),
      };

      const response = await fetch(
        "https://lasting-master-walleye.ngrok-free.app/whatsappAttachedFile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
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

  return (
    <div className={styles.contentTotalForm}>
      <div>
        <h1 className={styles.titelForm}>Enviar comprobante de pago</h1>
      </div>
      <div className={styles.contentForm}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Control
            id="nombreYApellidos"
            type="text"
            titleLabel="Nombre Completo"
            onChange={handleChangeForm}
            value={formData.nombreYApellidos}
            name="nombreYApellidos"
          />
          <Control
            id="numeroDocumento"
            type="text"
            titleLabel="Numero de Documento"
            onChange={handleChangeForm}
            value={formData.numeroDocumento}
            name="numeroDocumento"
          />
          <Control
            id="direccion"
            type="text"
            titleLabel="Dirección"
            onChange={handleChangeForm}
            value={formData.direccion}
            name="direccion"
          />
          <Control
            id="telefonoSocio"
            type="number"
            titleLabel="Telefono"
            onChange={handleChangeForm}
            value={formData.telefonoSocio}
            name="telefonoSocio"
          />
          <Control
            id="periodo"
            type="text"
            titleLabel="periodoo"
            onChange={handleChangeForm}
            value={formData.periodo}
            name="periodo"
          />
          <div>
            <h3>Tipo de Pago</h3>
            <div className={styles.inputRadioTypePayment}>
              <label>
                <input
                  type="radio"
                  id="contado"
                  name="paymentType"
                  checked={hideAbono}
                  onChange={handleChange}
                />
                Pago al contado
              </label>
              <label>
                <input
                  type="radio"
                  id="partes"
                  name="paymentType"
                  checked={!hideAbono}
                  onChange={handleChange}
                />
                Pago en partes
              </label>
            </div>
            <Control
              id="precio"
              type="number"
              titleLabel="Precio"
              onChange={handleChange}
              value={formData.precio}
              name="precio"
            />
            {!hideAbono && (
              <Control
                id="abono"
                type="number"
                titleLabel="Abono"
                onChange={handleChange}
                value={formData.abono}
                name="abono"
              />
            )}
          </div>
          <Control
            id="formaDePago"
            type="text"
            titleLabel="Forma de pago"
            onChange={handleChangeForm}
            value={formData.formaDePago}
            name="formaDePago"
          />
          <Calendar
            id="inicioDeMembresia"
            labelName="Inicio de membresia"
            onChange={handleDateChange("inicioDeMembresia")}
            value={formData.inicioDeMembresia}
          />
          <Calendar
            id="terminoDeMembresia"
            labelName="Termino de membresia"
            onChange={handleDateChange("terminoDeMembresia")}
            value={formData.terminoDeMembresia}
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
