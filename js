import * as functions from "firebase-functions";
import fetch from "node-fetch";
import { db } from "./firebaseConfig.js";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

export const mercadopagoWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === "payment") {
      const paymentId = data.id;

      const paymentInfo = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${functions.config().mercadopago.token}`,
          },
        }
      ).then(res => res.json());

      const status = paymentInfo.status; // "approved", "pending", "rejected"
      const referenceId = paymentInfo.external_reference; // tu transactionId

      const txRef = doc(db, "transactions", referenceId);
      await updateDoc(txRef, {
        status: status === "approved" ? "completado" : status,
        updatedAt: Timestamp.now(),
      });

      console.log(`Transacción ${referenceId} actualizada a ${status}`);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error en webhook:", error);
    res.sendStatus(500);
  }
});