<?php
require_once __DIR__ . "/../../core/Database.php";

class GateTicketModel
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getPDO();
    }

    public function getAll()
    {
        $sql = "SELECT * FROM gate_tickets ORDER BY id ASC";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll();
    }

    public function findById($id)
    {
        $sql = "SELECT * FROM gate_tickets WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data)
    {
        $sql = "
            INSERT INTO gate_tickets (name, price, description, status, type)
            VALUES (?, ?, ?, ?, ?)
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['price'],
            $data['description'],
            $data['status'] ?? 'ACTIVE',
            $data['type'] ?? 'ALL'
        ]);
        return $this->pdo->lastInsertId();
    }

    public function update($id, $data)
    {
        $sql = "
            UPDATE gate_tickets 
            SET name = ?, price = ?, description = ?, status = ?, type = ?
            WHERE id = ?
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['price'],
            $data['description'],
            $data['status'],
            $data['type'],
            $id
        ]);
        return $stmt->rowCount() > 0;
    }

    public function delete($id)
    {
        $sql = "DELETE FROM gate_tickets WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }
}
