create table Usuario(
Usuario varchar(255) not null,
Correo_Electronico varchar(255) not null,
Contraseña varchar(255) not null)

select*from Usuario

CREATE TABLE detalle_venta (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre_cliente TEXT,
    compra TEXT,
    total_productos INT,
    total_pagar DECIMAL(10,2),
    fecha DATE
);
drop table detalle_venta
delete from detalle_venta
select*from detalle_venta

insert into detalle_venta (nombre_cliente,compra,total_productos,total_pagar,fecha)