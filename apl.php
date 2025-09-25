<?php
require_once __DIR__ . '/../includes/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Get all products
        $stmt = $conn->prepare("SELECT * FROM products");
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($products);
        break;
    
    case 'POST':
        // Add new product
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'];
        $price = $data['price'];
        $category = $data['category'];
        $description = $data['description'];
        $image = $data['image'];

        $stmt = $conn->prepare("INSERT INTO products (name, price, category, description, image) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $price, $category, $description, $image]);
        $id = $conn->lastInsertId();
        echo json_encode(['id' => $id]);
        break;
    
    case 'DELETE':
        // Delete product
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}