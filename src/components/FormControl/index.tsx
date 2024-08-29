"use client";
import React, { useState } from "react";
import Control from "../Control";
import Calendar from "../Calendar";
import styles from "./styles.module.css";
import { SendProofOfPayment } from "../../types/entities/SendProofOfPayment";
import Modal from "../Modal";
import * as Yup from "yup";

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

const validationSchema = Yup.object().shape({
  nombreYApellidos: Yup.string().required("Este campo es requerido"),
  numeroDocumento: Yup.string().required("Este campo es requerido"),
  direccion: Yup.string().required("Este campo es requerido"),
  telefonoSocio: Yup.string().matches(
    /^9\d{8}$/,
    "Ingrese un número de teléfono válido"
  ),
  periodo: Yup.string().required("Este campo es requerido"),
  precio: Yup.string().required("Ingresa un número válido y diferente de 0"),
  abono: Yup.string().required("Ingresa un número válido y diferente de 0"),
});

export default function FormControl() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<SendProofOfPayment>(
    initialProofOfPayment
  );
  const [hideAbono, setHideAbono] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowModal(true);
  };

  const validateField = async (name: string, value: string) => {
    try {
      await validationSchema.validateAt(name, { ...formData, [name]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } catch (err) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: (err as Yup.ValidationError).message,
      }));
    }
  };

  const handleConfirm = () => {
    setShowModal(false);
    sendPaymentProof(formData).then((message) => {
      alert(message);
    });
    setFormData(initialProofOfPayment);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let filteredValue = value;

    if (name === "telefonoSocio") {
      filteredValue = value.replace(/[^0-9]/g, "");
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "precio" || name === "abono"
          ? Number(filteredValue)
          : filteredValue,
    }));
    validateField(name, filteredValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleChangeHideAbono = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await validationSchema.validate(formData, { abortEarly: false });
      const formattedData = {
        ...data,
        inicioDeMembresia: formatDate(data.inicioDeMembresia),
        terminoDeMembresia: formatDate(data.terminoDeMembresia),
        telefonoSocio: String(data.telefonoSocio),
        precio: Number(data.precio),
        abono: Number(data.abono),
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

      console.log("Comprobante enviado:");
      return "Comprobante enviado con éxito";
    } catch (error) {
      console.error("Error al enviar comprobante:", error);
      return "Error al enviar comprobante";
    }
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { name } = e.target as HTMLInputElement;

    if (
      name === "telefonoSocio" &&
      !/[\d]/.test(e.key) &&
      e.key !== "Backspace"
    ) {
      e.preventDefault();
    }
  };

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
            onBlur={handleBlur}
            value={formData.nombreYApellidos}
            name="nombreYApellidos"
            error={errors.nombreYApellidos}
          />
          <Control
            id="numeroDocumento"
            type="text"
            titleLabel="Numero de Documento"
            onChange={handleChangeForm}
            onBlur={handleBlur}
            value={formData.numeroDocumento}
            name="numeroDocumento"
            error={errors.numeroDocumento}
          />
          <Control
            id="direccion"
            type="text"
            titleLabel="Dirección"
            onChange={handleChangeForm}
            onBlur={handleBlur}
            value={formData.direccion}
            name="direccion"
            error={errors.direccion}
          />
          <Control
            id="telefonoSocio"
            type="tel"
            titleLabel="Telefono"
            onChange={handleChangeForm}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            value={formData.telefonoSocio}
            name="telefonoSocio"
            error={errors.telefonoSocio}
          />
          <Control
            id="periodo"
            type="text"
            titleLabel="Periodo"
            onChange={handleChangeForm}
            onBlur={handleBlur}
            value={formData.periodo}
            name="periodo"
            error={errors.periodo}
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
                  onChange={handleChangeHideAbono}
                />
                Pago al contado
              </label>
              <label>
                <input
                  type="radio"
                  id="partes"
                  name="paymentType"
                  checked={!hideAbono}
                  onChange={handleChangeHideAbono}
                />
                Pago en partes
              </label>
            </div>
            <Control
              id="precio"
              type="number"
              titleLabel="Precio"
              onChange={handleChangeForm}
              onBlur={handleBlur}
              value={formData.precio}
              name="precio"
              error={errors.precio}
            />
            {!hideAbono && (
              <Control
                id="abono"
                type="number"
                titleLabel="Abono"
                onChange={handleChangeForm}
                onBlur={handleBlur}
                value={formData.abono}
                name="abono"
                error={errors.abono}
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
