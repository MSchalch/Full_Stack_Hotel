package br.com.hotel.dto;

import java.util.List;

public class PageDTO<T> {
    private List<T> content;
    private long totalElements;
    private int totalPages;
    private int size;
    private int number;

    public PageDTO(List<T> content, long totalElements, int size, int number) {
        this.content = content;
        this.totalElements = totalElements;
        this.size = size;
        this.number = number;
        this.totalPages = size > 0 ? (int) Math.ceil((double) totalElements / size) : 0;
    }

    public List<T> getContent() {
        return content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }
}
